const Intrest = require("../../Models/intrest.model");
const { Op } = require("sequelize");
const respHandler = require("../../Handlers");

const AddIntrest = async (req, res) => {
  try {
    let { name } = req.body;
    let [intrest, created] = await Intrest.findOrCreate({
      where: { name },
    });
    if (!created) {
      return respHandler.error(res, {
        status: false,
        msg: `Interest with name ${name} already exist!!`,
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Interest created successfully!!",
    });
  } catch (err) {
    console.log(err);
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const GetIntrest = async (req, res) => {
  try {
    let intrests = await Intrest.findAll({ attributes: ["id", "name"] });

    return respHandler.success(res, {
      status: true,
      msg: "Interest listed successfully!!",
      data: intrests,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdateIntrest = async (req, res) => {
  try {
    let { id } = req.params;
    let { name } = req.body;

    let checkintrest = await Intrest.findOne({
      where: {
        name: name,
        id: {
          [Op.ne]: id,
        },
      },
    });
    if (checkintrest) {
      return respHandler.error(res, {
        status: false,
        msg: "Interest with name " + name + " already exist!!",
      });
    }

    let intrest = await Intrest.update(
      { name },
      {
        where: {
          id: id,
        },
      }
    );
    if (!intrest[0]) {
      return respHandler.error(res, {
        status: false,
        msg: `No data found!!`,
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Interest updated successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const DeleteIntrest = async (req, res) => {
  try {
    let { id } = req.params;
    let intrest = await Intrest.findByPk(id);
    if (!intrest) {
      return respHandler.error(res, {
        status: false,
        msg: "No Data Found!!",
      });
    }

    intrest.destroy();
    return respHandler.success(res, {
      status: true,
      msg: "Interest deleted successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

module.exports = {
  AddIntrest,
  GetIntrest,
  UpdateIntrest,
  DeleteIntrest,
};
