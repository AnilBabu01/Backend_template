const PageStatus = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

const AgeRange = {
  12: 17,
  18: 25,
  26: 35,
  35: 50,
  50: 100,
};

const ProposalStatus = {
  PENDING: 0,
  ACCEPT: 1,
  IGNORE: 2,
};

const OrderStatus = {
  CONFIRM: 1,
  REVIEW: 3,
  NOTDONE: 2,
};

const SortBy = {
  POPULARITY: 1,
  LATEST: 2,
  LOWTOHIGH: 3,
  HIGHTOLOW: 4,
};

const Status = {
  COMPLETED:1,
  ACTIVE:0,
  CANCEL:2
}

const OrderStep = {
  OrderDetailPage: 1,
  CreatorProposal: 2,
  Billing: 3,
  AdAdded: 4,
  AdsConfirmation: 5,
  OrderFeedbackStatus: 6,
};

const FollowerRange = {
  0: 1000,
  1000: 5000,
  5000: 10000,
  10000: 20000,
  20000: 50000,
  50000: 100000,
};

const SellOrderStep = {
  OrderCreated: 1,
  Billing: 2,
  SellerLoginCredential: 3,
  AdminVerifyCredential: 4,
  BuyerConfirmation: 5,
  SellerPaymentConfirmation: 6,
};

const PaymentStatus = {
  PENDING : 0,
  ACCEPTED : 1,
  REJECTED : 2,
  REFUND : 3,
}

module.exports = {
  PageStatus,
  AgeRange,
  ProposalStatus,
  OrderStatus,
  SortBy,
  FollowerRange,
  OrderStep,
  SellOrderStep,
  Status,
  PaymentStatus
};
