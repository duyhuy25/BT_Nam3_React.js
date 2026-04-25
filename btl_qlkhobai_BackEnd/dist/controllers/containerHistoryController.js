"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContainerHistory = exports.deleteContainerHistory = exports.updateContainerHistory = exports.addContainerHistory = exports.getContainerHistorys = void 0;
const containerHistoryService_1 = require("../services/containerHistoryService");
const getContainerHistorys = async (req, res) => {
    try {
        const data = await (0, containerHistoryService_1.fetchHistory)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getContainerHistorys = getContainerHistorys;
const addContainerHistory = async (req, res) => {
    try {
        await (0, containerHistoryService_1.createHistoryService)(req.body);
        res.json({ message: "Thêm lịch sử container thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addContainerHistory = addContainerHistory;
const updateContainerHistory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, containerHistoryService_1.updateHistoryService)(id, req.body);
        res.json({ message: "Cập nhật lịch sử thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateContainerHistory = updateContainerHistory;
const deleteContainerHistory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, containerHistoryService_1.deleteHistoryService)(id);
        res.json({ message: "Xóa lịch sử thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteContainerHistory = deleteContainerHistory;
const searchContainerHistory = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await (0, containerHistoryService_1.searchHistoryService)(String(search || ""));
        res.json(data);
    }
    catch (error) {
        console.error("=== SEARCH HISTORY ERROR ===", error);
        res.status(500).json({
            message: "Lỗi khi tìm kiếm lịch sử container",
            detail: error.message,
        });
    }
};
exports.searchContainerHistory = searchContainerHistory;
