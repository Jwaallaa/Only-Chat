import bcrypt from 'bcryptjs'

export const passcrypt = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
    }

export const checkpass = (password , hash)=>{
    return bcrypt.compareSync(password, hash);
}