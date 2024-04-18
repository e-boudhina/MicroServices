import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayloadWithRt } from "../types";

export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      console.log('inside get current user annotation');
      //console.log(request);
      //the user data exist in teh request
      //console.log(request.user);

      if (!data) 
          //console.log('data fouind');
          return request.user;
      return request.user[data];
    },
);