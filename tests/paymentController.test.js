const PaymentController = require('../app_server/controllers/paymentController');
const PaymentService = require('../app_server/services/paymentService');

describe('PaymentController', () => {
    let paymentController;
    let paymentService;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        paymentService = new PaymentService();
        paymentController = new PaymentController(paymentService);
        
        mockRequest = {
            ip: '127.0.0.1',
            body: {}
        };
        
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            render: jest.fn()
        };
    });

    test('initializePayment başarılı şekilde token oluşturmalı', async () => {
        await paymentController.initializePayment(mockRequest, mockResponse);
        expect(mockResponse.render).toHaveBeenCalled();
    });

    test('handleCallback geçerli bir callback\'i doğru işlemeli', async () => {
        const mockCallback = {
            merchant_oid: 'test123',
            status: 'success',
            total_amount: '100.99',
            hash: 'dummy_hash'
        };

        mockRequest.body = mockCallback;
        
        // Hash doğrulama işlemini mock'layalım
        const originalValidateCallback = paymentController._validateCallback;
        paymentController._validateCallback = jest.fn();

        await paymentController.handleCallback(mockRequest, mockResponse);
        
        expect(mockResponse.send).toHaveBeenCalledWith('OK');
        
        // Orijinal metodu geri yükleyelim
        paymentController._validateCallback = originalValidateCallback;
    });
}); 