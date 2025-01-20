export class Channel {
  id!: string;
  name: string;
  users: string[]; 

  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.name = obj?.name || '';
    this.users = obj?.users ? [...obj.users] : []; 
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      users: this.users, 
    };
  }
}