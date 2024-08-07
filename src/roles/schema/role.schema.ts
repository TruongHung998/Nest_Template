import { Permission } from "@/permissions/schema/permission.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  isActive: boolean;
  @Prop({ type: mongoose.Types.ObjectId })
  permission: Permission;
  //Const Field

  @Prop()
  createAt: Date;

  @Prop()
  updateAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
export const RoleSchema = SchemaFactory.createForClass(Role);
