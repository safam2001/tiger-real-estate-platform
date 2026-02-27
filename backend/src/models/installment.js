
const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Installment = sequelize.define("Installment", {

  bookingId: {
     type: DataTypes.INTEGER,
      allowNull: false 
    },
  installmentNumber: { 
    type: DataTypes.INTEGER, 
    allowNull: false
   },
   type:{
    type: DataTypes.STRING,
   
   },
  amount: { 
    type: DataTypes.FLOAT,
     allowNull: false 
    },
  currency: { 
    type: DataTypes.STRING, 
    defaultValue: "USD" 
  },
  dueDate: { 
    type: DataTypes.DATE,
     allowNull: false
     },
  paidDate: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
  status: {
     type: DataTypes.ENUM("pending","paid","overdue","cancelled"), 
     defaultValue: "pending"
     },
  paymentMethod: {
     type: DataTypes.STRING,
      allowNull: true
     },
    //  غرامات التأخير
  lateFee: { 
    type: DataTypes.FLOAT,
     defaultValue: 0 
    },
  notes: {
     type: DataTypes.TEXT, 
     allowNull: true 
    }
}, {
  sequelize,
  modelName: "Installment",
  timestamps: true
});

Installment.beforeUpdate((inst) => {
  const now = new Date();
  if(inst.status === "pending" && inst.dueDate < now){
    inst.status = "overdue";
  }
});

module.exports = Installment;