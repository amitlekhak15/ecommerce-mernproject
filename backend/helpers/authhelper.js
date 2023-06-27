import bcrypt from "bcrypt"
export const hashedpassword=async(password)=>{
    try{
        const saltRounds=10
        const hashpassword=await bcrypt.hash(password,saltRounds)
        return hashpassword
    }
    catch(err){
        console.log(err)

    }
}
export const comparePassword=async(password,hashpassword)=>{
    return bcrypt.compare(password,hashpassword)

}