// controllers/leadController.js

exports.bulkUpload = async (req, res) => {
  try {
    const data = req.body.data; // Array of Excel rows

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data" });
    }

    // Insert into PostgreSQL
    for (let row of data) {
      await db.query(
        `INSERT INTO lead_submitted (
          serial_number, tender_name, customer, tender_date,
          bid_owner, rfp_received_on, emd_value, rfp_due_date,
          tender_ref_no
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          row.serial_number,
          row.tender_name,
          row.customer,
          row.tender_date,
          row.bid_owner,
          row.rfp_received_on,
          row.emd_value,
          row.rfp_due_date,
          row.tender_ref_no,
        ]
      );
    }

    return res.json({ message: "Bulk upload successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
