"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContractService = exports.deleteContractService = exports.updateContractService = exports.addContractService = exports.fetchContract = void 0;
const contractRepositories_1 = require("../repositories/contractRepositories");
const fetchContract = async () => {
    return await (0, contractRepositories_1.getAllContract)();
};
exports.fetchContract = fetchContract;
const invoiceRepositories_1 = require("../repositories/invoiceRepositories");
const addContractService = async (data) => {
    const result = await (0, contractRepositories_1.createContract)(data);
    if (result.recordset && result.recordset.length > 0) {
        const newHopDongID = result.recordset[0].HopDongID;
        await (0, invoiceRepositories_1.createInvoice)({
            HopDongID: newHopDongID,
            SoTien: data.GiaTri || 0,
            NgayLap: new Date(),
            PhanTramDaThanhToan: 0
        });
    }
    return result;
};
exports.addContractService = addContractService;
const updateContractService = async (id, data) => {
    return await (0, contractRepositories_1.updateContractById)(id, data);
};
exports.updateContractService = updateContractService;
const deleteContractService = async (id) => {
    return await (0, contractRepositories_1.deleteContractById)(id);
};
exports.deleteContractService = deleteContractService;
const searchContractService = async (keyword) => {
    return await (0, contractRepositories_1.searchContractByKeyword)(keyword);
};
exports.searchContractService = searchContractService;
