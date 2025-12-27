export const EmailTemplate = (firstName: string, lastName: string, resetLink: string, verificationCode: string, expirationDate: Date) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
      <div style="max-width: 700px; margin: 10px auto; background-color: #ffffff; border-radius: 1px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 10px;">
          <h3>Password Reset</h3>
        </div>
        <div style="padding: 20px; text-align: left;">
          <h4 style="color: #333;">Hello ${firstName + " " + lastName}</h4>
          <span style="color: #333;">Your verification code is</span>
          <h4 style="display: inline;">
            <b>${verificationCode}</b>
            <span style="color: #333; margin-left: 5px;">expires at</span>
            <b>${expirationDate}</b>
          </h4>
          <p style="color: #555;">You requested to reset your password. Please click the button below to reset it.</p>
          <div style="margin-top: 20px;">
            <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 2px; font-size: 13px;">
              Reset Password
            </a>
          </div>
        </div>
        <div style="background-color: #f1f1f1; padding: 10px; text-align: left; font-size: 12px; color: #777;">
          <p>If you didn't request a password reset, you can ignore this email.</p>
        </div>
      </div>
    </div>`;
};
