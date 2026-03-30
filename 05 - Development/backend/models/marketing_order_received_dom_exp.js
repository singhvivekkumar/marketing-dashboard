export const MarketingOrderReceivedDomExp = (sequelize, Sequelize) => {
  
  const MarketingOrderReceivedDomExp = sequelize.define("MarketingOrderReceivedDomExp",
    {

      // projectTitle: data.projectTitle,
      // customerName: data.customerName,
      // customerAddress: data.customerAddress,
      // defenceOrNonDefence: data.defenceOrNonDefence,
      // PoCoWoNo: data.PoCoWoNo,
      // orderRxdDate: data.orderRxdDate,
      // qty: data.qty,
      // valueWithoutGST: parseFloat(parseFloat(data.valueWithoutGST).toFixed(2)),
      // valueWithGST: parseFloat(parseFloat(data.valueWithGST).toFixed(2)),
      // tenderType: data.tenderType,
      // deliverySchedule: data.deliverySchedule,
      // remarks: data.remarks,
      // JSON_competitors: data.JSON_competitors,
      // attachment: selectedFiles.map((f) => f.name),

      // submittedAt: new Date().toISOString(),
      // // new fields
      // OperatorId: user.id || "291536",
      // OperatorName: user.username || "Vivek Kumar Singh",
      // OperatorRole: user.userRole || "Lead Owner",
      // OperatorSBU: "Software SBU",

      // Dom_or_Export: "1",

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
      },

      projectTitle: {
        type: Sequelize.TEXT,
      },

      customerName: {
        type: Sequelize.TEXT,
      },
      
      customerAddress: {
        type: Sequelize.TEXT,
      },

      defenceOrNonDefence: {
        type: Sequelize.STRING,
      },
      // PoCoWoNo: {
      //   type: Sequelize.STRING,
        
      // },
      orderRxdDate: {
        type: Sequelize.STRING,
      },
      // qty: {
      //   type: Sequelize.STRING,
      // },
      valueWithoutGST: {
        type: Sequelize.TEXT,
      },
      valueWithGST: {
        type: Sequelize.STRING,
      },
      tenderType: {
        type: Sequelize.STRING,
      },
      // deliverySchedule: {
      //   type: Sequelize.TEXT,
      // },
      remarks: {
        type: Sequelize.TEXT,
      },
      JSON_competitors: {
        type: Sequelize.STRING,
      },
     
      OperatorId: {
        type: Sequelize.STRING,
      },
      
      OperatorName: {
        type: Sequelize.STRING
      },
      OperatorRole: {
        type: Sequelize.STRING,
      },
      OperatorSBU: {
        type: Sequelize.STRING,
      },
      // This is removed because we have create a seprate tabele to manage documents of contractCopy and letterOfIntenet
      // FileName: {
      //   type: Sequelize.JSON
      // },
      // FilePath: {
      //   type: Sequelize.JSON
      // },
      // HardDiskFileName: {
      //   type: Sequelize.JSON
      // },
      Dom_or_Export: {
        type: Sequelize.STRING
      },
      
  });

  //console.log(MarketingOrderReceivedDomExp)

  return MarketingOrderReceivedDomExp;
};
