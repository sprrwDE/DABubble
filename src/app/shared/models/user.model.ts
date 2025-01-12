export class User {
 name: string;
 email: string;
 image: string;
 status: string;
 id!: string;

 constructor(obj?: any) {
    this.name = obj ? obj.name : '';
    this.email = obj ? obj.email : '';
    this.image = obj ? obj.image : '';
    this.status = obj ? obj.status : '';
    this.id = obj ? obj.id : '';
 }

 toJSON() {
   return {
     name: this.name,
     email: this.email,
     image: this.image,
     status: this.status,
     id: this.id,
   };
 }
}