const PaymentController = require('./app_server/controllers/paymentController');
const PaymentService = require('./app_server/services/paymentService');

const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

// Route'ları güncelle
app.get("/", (req, res) => paymentController.initializePayment(req, res));
app.post("/callback", (req, res) => paymentController.handleCallback(req, res)); 