import Mock from "mockjs";

export default {
  mock(...arg) {
    return Mock.mock(...arg);
  },
  mockRequest(mockData) {
    mockData = mockData || {};
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            message: "successs",
            code: 0,
            data: mockData
          }),
        1000
      );
    });
  }
};
