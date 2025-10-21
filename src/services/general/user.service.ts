import { Request, Response } from 'express';
import UserRepository from '../../repositories/general/UserRepository';
import AuthMiddleware from '../../auth/jwt';
import PasswordManager from '../../auth/passwordManager';
import asyncHandler from '../../common/asyncHandler';
import OTP from "../../lib/classes/Otp";
import RoleRepository from '../../repositories/rbac/roles.repository';
import { ErrorResponse } from '../../middlewares/errorHandler';
import RegisterDTO from '../../dto/classes/Register.dto';
import emailService from './email.service';
import CommonService from './common.service';
const PasswordManagerClass = new PasswordManager();
import emailTemplates from '../../lib/emailTemplates.json';
import jwt from 'jsonwebtoken';

class UserService {

  //app logics

  static visitorLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserRepository.findUserByEmail(email);

    if (!user || user === null) {
      res.generalResponse("User Not Found!", user);
    } else if (user['Role.type'] !== 'VISITOR') {
      res.generalError("You are not allowed to access this resource", {}, 401)
    } else {
      const isCorrectPass = await PasswordManagerClass.comparePassword(user.password, password)
      if (!isCorrectPass) {
        res.generalError("Username or password is invalid", {}, 401)
      } else {
        const jwt = AuthMiddleware.createJwt({
          id: user.id,
          roleId: user.roleId,
          email: user.email
        })

        delete user.password

        res.generalResponse("Login Successful", { ...user, token: jwt });
      }
    }

  })


  static adminLogin = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;
    // console.log("req.body", req.body)
    const user = await UserRepository.findUserByEmail(email);
    // console.log("user", user)

    if (!user || user === null) {
      res.generalError("Username or password is not valid!", {}, 404);
    } else if (user['Role.type'] !== 'ADMIN') {
      res.generalError("You are not allowed to access this resource", {}, 401)
    } else {
      const isCorrectPass = await PasswordManagerClass.comparePassword(user.password, password)
      console.log("isCorrectPass", isCorrectPass)
      if (!isCorrectPass) {
        res.generalError("Username or password is invalid", {}, 401)
      } else {
        const jwt = AuthMiddleware.createJwt({
          id: user.id,
          roleId: user.roleId,
          email: user.email,
          type: user.type
        })

        delete user?.password
        delete user?.createdBy
        delete user?.updatedBy
        delete user?.isDeleted
        delete user?.deletedBy
        delete user?.deletedAt
        delete user?.createdAt
        delete user?.updatedAt
        // res.cookie('token', jwt, { secure: true, httpOnly: true })
        res.generalResponse("Login Successful", { ...user, token: jwt });
      }
    }

  })

  static revieweroperatorLogin = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;
    // console.log("req.body", req.body)
    const user = await UserRepository.findUserByEmail(email);
    // console.log("user", user)
    if(user.status !== 'Approved') {
      return  res.generalError("Your account is not approved yet!", {}, 403);
    }
    if (!user || user === null) {
      res.generalError("Username or password is not valid!", {}, 404);
    } else if (user['Role.type'] === 'ADMIN') {
      res.generalError("You are not allowed to access this resource", {}, 401)
    } else {
      const isCorrectPass = await PasswordManagerClass.comparePassword(user.password, password)
      console.log("isCorrectPass", isCorrectPass)
      if (!isCorrectPass) {
        res.generalError("Username or password is invalid", {}, 401)
      } else {
        const jwt = AuthMiddleware.createJwt({
          id: user.id,
          roleId: user.roleId,
          name: user.name,
          email: user.email,
          type: user.type
        })

        delete user?.password
        delete user?.createdBy
        delete user?.updatedBy
        delete user?.isDeleted
        delete user?.deletedBy
        delete user?.deletedAt
        delete user?.createdAt
        delete user?.updatedAt
        // res.cookie('token', jwt, { secure: true, httpOnly: true })
        res.generalResponse("Login Successful", { ...user, token: jwt });
      }
    }

  })

  static logout = asyncHandler(async (req: Request, res: Response) => {
    try {
      const expiredToken = AuthMiddleware.createJwt({}, "short")
      res.clearCookie('jwt');
      res.cookie('jwt', expiredToken, { httpOnly: true, secure: true });
      res.json({ message: 'Logout successful' });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })


  static adminRegister = asyncHandler(async (req: Request, res: Response) => {

    const dto = new RegisterDTO();
    dto.name = req.body.name;
    dto.cnic = req.body.cnic;
    dto.email = req.body.email;
    dto.govtID = req.body.govtID;
    dto.designation = req.body.designation;
    dto.roleType = req.body.roleType;
    dto.deptID = req.body.deptID;
    dto.dptIdDoc = req.body.dptIdDoc;
    dto.password = req.body.password;
    let roleId: number;
    if (req.body.roleType === 'OPERATOR') {
      // dto.firstPageVisited = "/cases/submitted"
      roleId = 2;
    } else if (req.body.roleType === 'REVIEWER') {
      roleId = 3;
    } else {
      throw new ErrorResponse('Invalid role type');
    }
    const otherData = {
      type: 'OPERATOR_REVIEWER',
      roleId
    }

    const isUserExist = await UserRepository.findUserByEmail(dto.email);
    if (!isUserExist) {
      const pass = await PasswordManagerClass.encryptPassword(dto.password);
      const data = { ...dto, ...otherData, password: pass };
      const createdUser = await UserRepository.createUser(data);
      // Prepare response with only the required fields
      const responseData = {
        id: createdUser.id,
        name: createdUser.name,
        cnic: createdUser.cnic,
        email: createdUser.email,
        govtID: createdUser.govtID,
        designation: createdUser.designation,
        roleType: createdUser.roleType,
        deptID: createdUser.deptID,
        dptIdDoc: createdUser.dptIdDoc,
        status: createdUser.status,
      };

      const verifyLink = `${process.env.EMAIL_VERIFICATION_URL}?token=${CommonService.generateEmailVerificationToken(createdUser.id, createdUser.email)}`;

      let email = await emailService.sendTemplateMail(responseData.email, emailTemplates?.welcome?.subject, emailTemplates?.welcome?.template, { name: responseData.name, verifyLink });
      console.log("email", email)
      res.generalResponse("User registered Successfully", responseData);

    } else {
      res.generalResponse("User already registered", isUserExist);
    }
  })

  static vistorRegister = asyncHandler(async (req: Request, res: Response) => {

    let data = req.body

    const isUserExist = await UserRepository.findUserByEmail(data['email']);

    if (!isUserExist) {
      const role = await RoleRepository.getRoleById(data.roleId)

      if (role?.dataValues?.type !== 'VISITOR') {
        throw new ErrorResponse('Role Id is not correct')
      }

      const pass = await PasswordManagerClass.encryptPassword(req.body.password)
      data = { ...req.body, password: pass }

      var createdUser = await UserRepository.createUser(data);
      let authToken = AuthMiddleware.createJwt({
        id: data.id,
        roleId: data.roleId,
        email: data.email
      });

      delete data?.password

      res.generalResponse("User registered Successfully", { ...data, token: authToken });
    } else {

      res.generalResponse("User already registered", createdUser);
    }
  })

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      // Return success message even if user doesn't exist for security reasons
      return res.generalResponse("If the email exists, a password reset link has been sent.");
    }

    // Generate password reset token
    const resetToken = CommonService.generatePasswordResetToken(user.id, user.email);
    const resetLink = `${process.env.PASSWORD_RESET_URL}?token=${resetToken}`;

    try {
      await emailService.sendTemplateMail(
        user.email,
        emailTemplates?.passwordReset?.subject,
        emailTemplates?.passwordReset?.template,
        { 
          name: user.name,
          resetLink: resetLink
        }
      );

      console.log(`Password reset email sent to: ${user.email}`);
      res.generalResponse("If the email exists, a password reset link has been sent.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      res.generalError("Failed to send reset email. Please try again later.", null, 500);
    }
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password, confirmPassword } = req.body;

    // Validate that passwords match
    if (password !== confirmPassword) {
      return res.generalError("Passwords do not match", null, 400);
    }

    // Verify the reset token
    const tokenData = CommonService.verifyPasswordResetToken(token);
    if (!tokenData) {
      return res.generalError("Invalid or expired reset token", null, 400);
    }

    try {
      // Find the user
      const user = await UserRepository.getUserById(tokenData.userId);
      if (!user) {
        return res.generalError("User not found", null, 404);
      }

      // Hash the new password
      const hashedPassword = await PasswordManagerClass.encryptPassword(password);

      // Update the user's password
      await UserRepository.updateUser(tokenData.userId, { password: hashedPassword });

      console.log(`Password reset successful for user: ${user.email}`);
      res.generalResponse("Password has been reset successfully. You can now login with your new password.");
    } catch (error) {
      console.error("Error resetting password:", error);
      res.generalError("Failed to reset password. Please try again later.", null, 500);
    }
  });

  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {

    const { email, otp } = req.body;
    const expiryDate = new Date().getMinutes() + 10;
    const record = await UserRepository.getOtp(email);
    // const
    // if (condition) {

    // }
    res.generalResponse("otp", record);

  });

  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const isUserExist = await UserRepository.findUserByEmail(email);
      if (!isUserExist) {
        res.generalError("User Not Found!", null, 404);
      } else {
        const userUpdated = UserRepository.updateUserByEmail(email, password);
        res.generalResponse("otp", userUpdated);
      }

    } catch (error) {
      res.generalError("Something went wrong!", null, 500)
    }
  })



  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Implement updateProfile functionality here
    } catch (error: any) {
      res.status(400).json({ message: `Error updating user profile: ${error.message}` });
    }
  }


  //admin logics

  static createUser = asyncHandler(async (req: Request, res: Response) => {
    try {
      const pass = await PasswordManagerClass.encryptPassword("123456")

      const result = await UserRepository.createUser({ ...req.body, password: pass, type: 'ADMIN', age: Number(req.body.age), branchId: Number(req.body.branchId) });
      delete result?.dataValues?.password;
      res.generalResponse('User created successfuly!', result)

    } catch (err) {
      console.log("err", err)
    }
  })

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserRepository.deleteUser(Number(id));
    res.generalResponse('User deleted successfuly!', {})
  })

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await UserRepository.updateUser(req.body.id, req.body.data);
    res.generalResponse('User updated successfuly!', result)
  })

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserRepository.getUserById(Number(id));
    res.generalResponse('Data fetched successfuly!', result)
  })

  static getUser = asyncHandler(async (req: Request, res: Response) => {
    if (req.user.type !== 'ADMIN') {
      return res.generalError("You are not allowed to access this resource", {}, 401);
    }
    const status = req.query.status as string;
    let query = { ...req.query };
    if (status && status !== 'All') {
      query = { ...query, status };
    } else {
      // Remove status if it's 'All' or not provided
      delete query.status;
    }
    const result = await UserRepository.getUsersWithoutAdmin(query);
    const actions = await CommonService.getPageActionsByRole(req?.user?.roleId, "User Registration");
    const updatedResult = {
      records: result.records
        .filter((user: any) => user.type !== "ADMIN")
        .map((user: any) => {
          return {
            id: user.id,
            name: user.name,
            cnic: user.cnic,
            email: user.email,
            govtID: user.govtID,
            designation: user.designation,
            deptID: user.deptID,
            dptIdDoc: user.dptIdDoc,
            status: user.status,
            roleId: user.roleId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }),
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalRecords: result.totalRecords,
      actions
    }
    res.generalResponse('Users fetched successfuly!', updatedResult)
  })

  static getMyPermissions = asyncHandler(async (req: Request, res: Response) => {
    const result = await UserRepository.getMyPermissions(req.user.roleId);
    res.generalResponse("Data fetch successfuly!!", result);
  })

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not defined');
      const decoded: any = jwt.verify(token, secret);
      if (decoded.type !== 'email_verification') {
        return res.status(400).json({ error: 'Invalid token type' });
      }
      // Check if already verified
      const user = await UserRepository.getUserById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.isEmailVerify) {
        return res.status(400).json({ error: 'Email already verified' });
      }
      await UserRepository.updateUser(decoded.userId, { isEmailVerify: true });
      // Optionally: store used tokens in DB or cache to prevent reuse
      res.generalResponse('Email verified successfully!', {});
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Token expired' });
      }
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  });

  static verification = asyncHandler(async (req: Request, res: Response) => {
    const { email, cnic, govtID } = req.body;
    const errors: { type: string; message: string }[] = [];

    try {
      if (email) {
        const userByEmail = await UserRepository.findUserByEmail(email);
        if (userByEmail) {
          errors.push({ type: 'email', message: 'Email already exists' });
        }
      }

      if (cnic) {
        const userByCnic = await UserRepository.findUserByKey("cnic", cnic);
        if (userByCnic) {
          errors.push({ type: 'cnic', message: 'CNIC already exists' });
        }
      }

      if (govtID) {
        const userByGovtID = await UserRepository.findUserByKey("govtID", govtID);
        if (userByGovtID) {
          errors.push({ type: 'govtID', message: 'Government ID already exists' });
        }
      }

      if (errors.length > 0) {
        return res.generalError('Validation failed', { errors }, 400);
      }

      return res.generalResponse('Verification successful');
    } catch (error) {
      return res.generalError('Something went wrong', { error }, 500);
    }
  });

}

export default UserService;