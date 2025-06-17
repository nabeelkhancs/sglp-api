class OTP {

  static generateOTP() {

    let digits = "012345678"
    let len = digits.length;
    let createOTP = "";

    for (let i = 0; i < 4; i++) {
      createOTP += digits[Math.floor(Math.random() * len)];
    }

    return createOTP;

  }
}

export default OTP;