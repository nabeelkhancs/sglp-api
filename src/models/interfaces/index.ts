export interface UsersAttributes {
  id?: number;
  name: string;
  otp?: Date;
  type: string;
  otpExpiry?: Date;
  roleId: number | null;
  branchId?: number;
  cnic?: string;
  govtID?: string;
  deptID?: string;
  dptIdDoc?: string;
  age?: number;
  email: string;
  status: string;
  firstPageVisited: string;
  password?: string;
  profilePic?: string | null;
  designation?: string | null;
  roleType?: string | null;
  isActive?: boolean;
  isEmailVerify?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted?: boolean;
  deletedBy?: string | null;
  deletedAt?: Date | null;
}

export interface IModules {
  id?: number;
  hasChild: boolean;
  label: string;
  icon: string;
  url: string;
  order: number;
  status?: string;
  createdBy?: number;
  updatedBy?: number;
  isDeleted?: boolean;
  deletedBy?: number;
  deletedAt?: Date;
}

export interface IPages {
  id?: number | number[];
  label: string;
  icon: string;
  url: string;
  order: number
  moduleId: number;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface IPermissions {
  id?: number;
  userId?: number;
  rolePageId: number;
  actionId: number;
}


export interface IRoles {
  id?: number;
  name: string;
  description: string;
  type: string;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface IAuditLogs {
  id?: number;
  action: string;
  cpNumber?: string;
  payload: string;
  userId: number
  isDeleted: boolean | null
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}

export interface INotifications {
  id?: number;
  type?: string;
  sender?: string;
  to?: string | null;
  cc?: string[] | null;
  bcc?: string[] | null;
  success?: boolean;
  error?: object | null;
  isDeleted?: boolean
  isRead?: boolean;
  auditLogId?: number | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
}

export interface IRolePage {
  id?: number;
  roleId: number;
  pageId: number
}

export interface PageParams {
  pageNumber?: number;
  pageSize?: number
}


export interface IActions {
  id?: number | number[];
  name: string;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string;
  deletedAt: Date | null;
}


export interface ICases {
  id?: number;
  caseNumber?: string;
  caseTitle: string;
  court: string;
  region: string;
  relativeDepartment: string;
  subjectOfApplication: string;
  dateReceived: Date;
  dateOfHearing: Date | null;
  caseStatus: string;
  caseRemarks: string;
  isUrgent: boolean;
  isCallToAttention: boolean;
  createdBy: number | null;
  uploadedFiles?: string[]; // Array of strings for uploaded files
  committeeApprovalFile?: string;
  updatedBy: number | null;
  isDeleted?: boolean;
  deletedBy?: number | null;
  deletedAt?: Date | null;
  isCsCalledInPerson?: boolean;
  cpNumber: string;
  caseType?: string;
  registry?: string;
}
export interface ICommittee {
  id?: number;
  cpNumber: string;
  court: string;
  compositionHeadedBy: string;
  tors: string;
  report: string;
  status: string;
  uploadedFiles?: string[];
  createdBy?: number;
  updatedBy?: number;
  isDeleted?: boolean;
  deletedBy?: number;
  deletedAt?: Date;
}