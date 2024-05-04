import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly baseLink: string;

  constructor(private mailerService: MailerService, private configService: ConfigService) {
    this.baseLink = `${this.configService.get<string>('BASE_ADDRESS')}`;
  }



  async sendResetPasswordEmail(user: User) {
     
    const resetPasswordLink = `${this.baseLink}/auth/new-password/${user.passwordResetToken}`;
    //console.log("User mail: "+user.email)
    await this.mailerService.sendMail({
      to: user.email,
      //from: '"Support Team" <support@example.com>', // override default from
      subject: 'Resseting your password', // make a predefined list in upper case and export it to be used here
      //text: "welcome",
      //html: "<b>welcome</b>",
      template: './resetPassword', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        username: user.username,
        resetPasswordLink
      },
      
    });
    return {
      message: 'Email sent! Check your email for the reset password link!'
    }  
  }

  async sendNewUserWithRoleEmail(user: User, rawGenaratedPwd: string) {
    //console.log(rawGenaratedPwd);
    const resetPasswordLink = `${this.baseLink}/auth/new-password/${user.passwordResetToken}`;
    //console.log("User mail: "+user.email)
    //add condittion to check return type of mail send and based on that return success message
    await this.mailerService.sendMail({
      to: user.email,
      //from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Axelites', // make a predefined list in upper case and export it to be used here
      template: './newUserWithRole', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        username: user.username,
        email: user.email,
        password: rawGenaratedPwd,
        resetPasswordLink,
      },
      
    });
    return {
      statusCode : HttpStatus.OK,
      message: 'User notified via email!'
    }  
  }

  async sendUserRegistrationEmail(user: User) {
    //console.log(rawGenaratedPwd);
    const loginLink = `${this.baseLink}/auth/signin/`;
    //console.log("User mail: "+user.email)
    //add condittion to check return type of mail send and based on that return success message
    await this.mailerService.sendMail({
      to: user.email,
      //from: '"Support Team" <support@example.com>', // override default from
      subject: 'Axelites Account Registration', // make a predefined list in upper case and export it to be used here     // export subjets to contstants, do the same for templates
      template: './registrationEmail', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        username: user.username,
        loginLink,
      },
      
    });
    return {
      statusCode : HttpStatus.OK,
      message: 'Registration Successful!'
    }  
  }






  async getUser() {
    //console.log(res);
    const res= {
      statusCode : HttpStatus.OK,
      message : "email sent successfully",
    } 

    return res;
  }

}
