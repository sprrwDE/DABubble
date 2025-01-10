export class User {
 name!: string;
 email!: string;
 image!: string;
 status!: string;
 pw!: string;
 id!: string;

 constructor(obj?: any) {
    this.name = obj ? obj.name : '';
    this.email = obj ? obj.email : '';
    this.image = obj ? obj.image : '';
    this.status = obj ? obj.status : '';
    this.pw = obj ? obj.pw : '';
    this.id = obj ? obj.id : '';
 }
}