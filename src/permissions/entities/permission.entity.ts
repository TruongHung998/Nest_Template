import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  isActive: boolean;

  // Default field

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column()
  createdBy: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column()
  updatedBy: string;
}
