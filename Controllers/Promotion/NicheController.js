const { Op } = require("sequelize");
const Niche = require("../../Models/niche.model");
const respHandler = require("../../Handlers");

const GetNiche = async (req, res) => {
  try {
    let niches = await Niche.findAll({ attributes: ["id", "name"] });
    return respHandler.success(res, {
      status: true,
      msg: "Niche listed successfully!!",
      data: niches,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const AddNiche = async (req, res) => {
  try {
    let { name } = req.body;
    let [niche, created] = await Niche.findOrCreate({
      where: { name },
    });
    if (!created) {
      return respHandler.error(res, {
        status: false,
        msg: `Niche with name ${name} already exist!!`,
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Niche created successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdateNiche = async (req, res) => {
  try {
    let { name } = req.body;
    let { id } = req.params;
    let niche = await Niche.findOne({
      where: { name: name, id: { [Op.ne]: id } },
    });
    if (niche) {
      return respHandler.error(res, {
        status: false,
        msg: `Niche with name ${name} already exist!!`,
      });
    }
    let updatedniche = await Niche.update(
      { name },
      {
        where: {
          id: id,
        },
      }
    );
    if (!updatedniche[0]) {
      return respHandler.error(res, {
        status: false,
        msg: `No data found!!`,
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Niche updated successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const DeleteNiche = async (req, res) => {
  try {
    let { id } = req.params;
    let niche = await Niche.findByPk(id);
    if (!niche) {
      return respHandler.error(res, { status: false, msg: "No Data Found!!" });
    }

    niche.destroy();
    return respHandler.success(res, {
      status: true,
      msg: "Niche Deleted successfully!!",
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

module.exports = {
  GetNiche,
  AddNiche,
  UpdateNiche,
  DeleteNiche,
};
