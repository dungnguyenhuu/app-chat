import mongoose from "mongoose";
// import bcrypt from "bcrypt"; mã hóa password

let Schema = mongoose.Schema;

// lưu thông tin về 1 tài khoản của người dùng
let UserSchema = new Schema({
    username: String,                                       // tên người dùng, tên đăng nhập
    gender: {type: String, default: "male"},                // giới tính, mặc định là male
    phone: {type: Number, default: null},                   // số điện thoại, mặc định là null
    address: {type: String, default: null},                 // địa chỉ, mặc đinh là null
    avatar: {type: String, default: "avatar-default.jpg"},  // link ảnh đại diện, có ảnh đại diện mặc định
    role: {type: String, default: "user"},                  // quyền của tại khoản, mặc định là user
    local: {                                                // tài khoản nhập khi tạo tài khoản
        email: {type: String, trim: true},
        password: String,
        isActive: {type: Boolean, default: true},
        verifyToken: String
    },
    facebook: {                                             // tài khoản đăng nhập bằng facebook
        uid: String,
        token: String,
        email: {type: String, trim: true}
    },
    google: {                                               // tài khoản đăng nhập bằng google
        uid: String,
        token: String,
        email: {type: String, trim: true}
    },
    createdAt: {type: Number, default: Date.now},           // ngày tạo, mặc định là thời gian khởi tạo
    updatedAt: {type: Number, default: null},               // ngày cập nhập, mặc định là null
    deletedAt: {type: Number, default: null}                // ngày xóa, mặc định là null
});

// các hàm thao tác với bảng user trên MongoDB
UserSchema.statics = {
    // tạo bản ghi mới
    createNew(item) {
        return this.create(item);
    },

    // tìm kiếm theo email
    findByEmail(email) {
        return this.findOne({"local.email": email}).exec();
    },

    // tìm kiếm theo id
    findUserById(id){
        // console.log(id);
        return this.findById(id).exec();
    },

    // cập nhập 
    updateUser(id, item) {
        // mongo khi update sẽ trả về dữ liệu cũ
        return this.findByIdAndUpdate(id, item).exec();
    },
};

UserSchema.methods = {
    //so sanh password
    comparePassword (password) {
        // return bcrypt.compare(password, this.local.password); return promise 
        return password === this.local.password;
    }
}

module.exports = mongoose.model("user", UserSchema);
