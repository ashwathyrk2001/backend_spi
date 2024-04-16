const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const LicenseRequest = require('../models/LicenseModel')

// Route to handle license requests
router.post('/licenserequest', async (req, res) => {
  try {
    const { dealerName, dealerEmail, tradeCode, address, shopLicenseNumber } = req.body;

    const newLicenseRequest = new LicenseRequest({
      dealerName,
      dealerEmail,
      tradeCode,
      address,
      shopLicenseNumber,
    });

    await newLicenseRequest.save();

    res.status(201).json({ msg: 'License request submitted successfully' });
  } catch (error) {
    console.error('Error submitting license request:', error);
    res.status(500).json({ msg: 'Failed to submit license request' });
  }
});


router.get('/getlicense', async (req, res) => {
    try {
      // Fetch all license requests from the database
      const licenseRequest = await LicenseRequest.find({});
      
      // Send the response with the license requests data
      res.json(licenseRequest);
    } catch (error) {
      // Handle errors
      console.error('Error fetching license requests:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Route to generate a license PDF
router.get('/generatelicense/:licenseid', async (req, res) => {
    try {
      const requestId = req.params.licenseid;
  
      // Fetch the license request data from your data source
      const licenseRequest = await LicenseRequest.findById(requestId);
  
      if (!licenseRequest) {
        return res.status(404).json({ error: 'License request not found' });
      }
  
      // Create a PDF document
      const pdfDoc = new PDFDocument();

      // Set the content of the PDF
      pdfDoc
        .fontSize(16)
        .text('Spices Board India', { align: 'center' })
        .moveDown(0.5)
        .fontSize(14)
        .text('License Issued', { align: 'center' })
        .moveDown(1)
        .text(`Your license for trading with Spices Board has been issued for ${licenseRequest.dealerName}`)
        .text(`Email: ${licenseRequest.dealerEmail}`)
        .text(`Trade Code: ${licenseRequest.tradeCode}`)
        .text(`Shop License Number: ${licenseRequest.shopLicenseNumber}`)
        .text(`Address: ${licenseRequest.address}`)
        .moveDown(1)
        .text('This license will be canceled after 1 year.')
        .moveDown(1)
        .text('Thank you for trading with Spices Board India.', { align: 'center' });
  
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=license_${requestId}.pdf`);
  
      // Create a buffer to store the PDF content
      const pdfBuffer = [];
      pdfDoc.on('data', (chunk) => pdfBuffer.push(chunk));
      pdfDoc.on('end', () => {
        const pdfData = Buffer.concat(pdfBuffer);
  
  
        // Send email with the generated PDF as an attachment
        const nodemailer = require('nodemailer');

        const emailUser ="ashwathyrk08@gmail.com";
        const emailPassword ="sjnq xrwa abho qsej";
        
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: emailUser,
            pass: emailPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        
        const mailOptions = {
          from: 'ashwathyrk08@gmail.com',
          to: licenseRequest.dealerEmail,
          subject: 'License PDF',
          text: 'Your License PDF is attached.',
          attachments: [
            {
              filename: `license_${requestId}.pdf`,
              content: pdfData,
            },
          ],
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'PDF generated and email sent successfully' });
          }
        });
      });
  
      // Pipe the PDF to the response
      pdfDoc.pipe(res);
  
      // Finalize the PDF
      pdfDoc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  
  // Reject a license request
  router.patch('/api/license-requests/reject/:id', async (req, res) => {
    try {
      const licenseRequest = await LicenseRequest.findByIdAndUpdate(
        req.params.id,
        { status: 'Rejected' },
        { new: true }
      );
  
      res.status(200).json(licenseRequest);
    } catch (error) {
      console.error('Error rejecting license request:', error);
      res.status(500).json({ msg: 'Failed to reject license request' });
    }
  });
  
module.exports = router;


