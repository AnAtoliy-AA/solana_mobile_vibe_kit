# Launch.meme API Reference

**Base URL:** `/api`

---

## Token Endpoints

- **POST /tokens/draft**  
  *Create a token draft without minting on the blockchain*  
  **Request Body:** `CreateTokenDraftDto`  
  **Response:** `CreateTokenOfflineResponse`

- **POST /sign-token-tx**  
  *Sign token minting transaction*  
  **Request Body:** `SignTokenTxDto`  
  **Response:** `SignTokenTxResponse`

- **POST /generate-token-tx**  
  *Generate Meteora pool creation transaction*  
  **Request Body:** `GenerateTokenTxDto`  
  **Response:** `GenerateTokenTxResponse`

- **POST /tokens**  
  *Get tokens list*  
  **Request Body:** `TokenListDto`  
  **Response:** `TokenQueryDto`

- **POST /tokens/live**  
  *Get list of tokens with live streaming*  
  **Request Body:** `TokenListDto`  
  **Response:** `TokenQueryDto`

- **POST /txs**  
  *Get token trades*  
  **Response:** `TransactionResponse`

- **POST /chat**  
  *Get or send token chat messages*  
  **Request Body:** `ChatMessageDto`  
  **Response:** `ChatSuccessResponse` or `ChatMessageResponse`

---

## Sign Endpoint

- **POST /sign**  
  *Get message to sign*  
  **Request Body:** `SignMessageDto`  

---

## User Endpoints

- **POST /profile**  
  *Get or update user profile*  
  **Request Body:** `ProfileDto`

- **POST /portfolio**  
  *Get user portfolio*  
  **Response:** `ProfileDto`

---

## Upload Endpoint

- **POST /upload**  
  *Upload a file to IPFS*  
  **Request Body:** `UploadRequestDto`  
  **Response:** `UploadResponseDto`

---

## Rewards Endpoint

- **GET /rewards**  
  *Get rewards by wallet*  
  **Response:** `RewardsResponseDto`

---

## Orders Endpoints

- **POST /orders**  
  *Create a new limit order*  
  **Request Body:** `CreateOrderDto`  
  **Response:** `OrderResponseDto`

- **GET /orders/{orderId}**  
  *Get order by ID*  
  **Response:** `OrderResponseDto`

- **GET /orders/wallet/{wallet}**  
  *Get orders by wallet address*  
  **Response:** `OrderResponseDto[]`

- **GET /orders/token/{token}**  
  *Get orders by token address for authenticated user*  
  **Response:** `OrderResponseDto[]`

- **GET /orders/expired**  
  *Get expired orders for authenticated user*  
  **Response:** `OrderResponseDto[]`

- **PATCH /orders/{orderId}/status**  
  *Update order status*  
  **Request Body:** `UpdateOrderStatusDto`  
  **Response:** `OrderResponseDto`

- **POST /orders/{orderId}/cancel**  
  *Cancel a pending order*  
  **Request Body:** `CancelOrderDto`  
  **Response:** `OrderResponseDto`

---

## Wallets Endpoints

- **POST /wallets**  
  *Create a new custodial wallet*  
  **Request Body:** `CreateWalletDto`  
  **Response:** `WalletDto`

- **GET /wallets**  
  *Get all wallets for authenticated user*  
  **Response:** `WalletDto[]`

- **GET /wallets/{publicKey}**  
  *Get wallet by public key*  
  **Response:** `WalletDto`

- **PUT /wallets/{publicKey}**  
  *Update wallet name/default status*  
  **Request Body:** `UpdateWalletDto`  
  **Response:** `WalletDto`

- **DELETE /wallets/{publicKey}**  
  *Delete a wallet*  
  **Response:** `SuccessResponse`

- **POST /wallets/{publicKey}/set-default**  
  *Set wallet as default*  
  **Response:** `SuccessResponse`

---

## Data Schemas

**The following data types are referenced in requests/responses above:**  
- `CreateTokenDraftDto`  
- `CreateTokenOfflineResponse`  
- `SignTokenTxDto`  
- `SignTokenTxResponse`  
- `GenerateTokenTxDto`  
- `GenerateTokenTxResponse`  
- `TokenListDto`  
- `TokenQueryDto`  
- `TransactionResponse`  
- `ChatMessageDto`  
- `ChatSuccessResponse`  
- `ChatMessageResponse`  
- `SignMessageDto`  
- `ProfileDto`  
- `UploadRequestDto`  
- `UploadResponseDto`  
- `RewardsResponseDto`  
- `CreateOrderDto`  
- `OrderResponseDto`  
- `UpdateOrderStatusDto`  
- `CancelOrderDto`  
- `WalletDto`  
- `UpdateWalletDto`  
- `SuccessResponse`

---

**Refer to the Swagger UI at `/docs` for detailed parameter definitions and example payloads.**  
Remove any endpoints and schemas not present in this listing from your markdown or codebase.

---

Development mode: *Mock-first, API integration when ready*. Ready to connect to real endpoints as soon as documentation or live API is accessible.
