export class User {
 name: string;
 email: string;
 image: string;
 status: string;
 id!: string;
 isNotGoogle: boolean;

 constructor(obj?: any) {
    this.name = obj ? obj.name : '';
    this.email = obj ? obj.email : '';
    this.image = obj ? obj.image : '';
    this.status = obj ? obj.status : '';
    this.id = obj ? obj.id : '';
    this.isNotGoogle = obj ? obj.isNotGoogle : false;

    // this.trackMouseStatus()
 }

 toJSON() {
   return {
     name: this.name,
     email: this.email,
     image: this.image,
     status: this.status,
     id: this.id,
     isNotGoogle: this.isNotGoogle
   };
 }

//  trackMouseStatus() {
//   setInterval(() => {
//     console.log('mouse moved')
//   }, 15000);
//  }
}