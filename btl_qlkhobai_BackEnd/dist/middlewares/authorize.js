"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || user.role !== role) {
            return res.status(403).json({
                message: "Bạn không có quyền thực hiện chức năng này!",
            });
        }
        next();
    };
};
exports.authorize = authorize;
