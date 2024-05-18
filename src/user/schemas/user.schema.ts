import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  age: Number;

  @Prop()
  address: string;

  @Prop()
  createAt: Date;

  @Prop()
  updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
