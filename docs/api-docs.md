# API Documentation

## RFP Contract Management System API

**Project Timeline**: 2 hours  
**Focus**: Core MVP endpoints only  

## 🔗 Base URL

```
https://your-domain.com/api
```

## 🔐 Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## 📋 Core Endpoints

### 1. Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "buyer" // or "supplier"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "buyer",
    "created_at": "2024-12-19T14:20:00Z"
  }
}
```

#### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

### 2. RFP Management

#### GET /rfps

List all RFPs (filtered by user role).

**Query Parameters:**

- `status`: Filter by status (draft, published, closed)
- `page`: Page number for pagination
- `limit`: Items per page

**Response:**

```json
{
  "rfps": [
    {
      "id": "uuid",
      "title": "Software Development Services",
      "description": "Need custom software development",
      "status": "published",
      "created_by": "buyer_uuid",
      "created_at": "2024-12-19T14:20:00Z",
      "deadline": "2024-12-26T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 10,
    "pages": 2
  }
}
```

#### POST /rfps

Create a new RFP (Buyers only).

**Request Body:**

```json
{
  "title": "Software Development Services",
  "description": "Need custom software development",
  "requirements": "React, Node.js, PostgreSQL",
  "budget_range": "50000-100000",
  "deadline": "2024-12-26T14:20:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "rfp": {
    "id": "uuid",
    "title": "Software Development Services",
    "status": "draft",
    "created_at": "2024-12-19T14:20:00Z"
  }
}
```

#### GET /rfps/{id}

Get RFP details by ID.

**Response:**

```json
{
  "rfp": {
    "id": "uuid",
    "title": "Software Development Services",
    "description": "Need custom software development",
    "requirements": "React, Node.js, PostgreSQL",
    "budget_range": "50000-100000",
    "status": "published",
    "created_by": "buyer_uuid",
    "created_at": "2024-12-19T14:20:00Z",
    "deadline": "2024-12-26T14:20:00Z"
  }
}
```

#### PUT /rfps/{id}

Update RFP (Buyers only, draft status only).

**Request Body:**

```json
{
  "title": "Updated Software Development Services",
  "description": "Updated description",
  "requirements": "React, Node.js, PostgreSQL, Docker"
}
```

#### POST /rfps/{id}/publish

Publish RFP (Buyers only, draft status only).

**Response:**

```json
{
  "success": true,
  "message": "RFP published successfully",
  "rfp": {
    "id": "uuid",
    "status": "published",
    "published_at": "2024-12-19T14:20:00Z"
  }
}
```

### 3. RFP Responses

#### GET /rfps/{id}/responses

Get responses for an RFP (Buyers only).

**Response:**

```json
{
  "responses": [
    {
      "id": "uuid",
      "rfp_id": "rfp_uuid",
      "supplier_id": "supplier_uuid",
      "proposal": "We can deliver this project...",
      "budget": 75000,
      "timeline": "3 months",
      "status": "submitted",
      "submitted_at": "2024-12-19T14:20:00Z"
    }
  ]
}
```

#### POST /rfps/{id}/responses

Submit response to RFP (Suppliers only).

**Request Body:**

```json
{
  "proposal": "We can deliver this project within your requirements...",
  "budget": 75000,
  "timeline": "3 months",
  "experience": "10+ years in software development"
}
```

**Response:**

```json
{
  "success": true,
  "response": {
    "id": "uuid",
    "rfp_id": "rfp_uuid",
    "status": "submitted",
    "submitted_at": "2024-12-19T14:20:00Z"
  }
}
```

#### PUT /rfps/{id}/responses/{response_id}/approve

Approve RFP response (Buyers only).

**Response:**

```json
{
  "success": true,
  "message": "Response approved successfully",
  "response": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2024-12-19T14:20:00Z"
  }
}
```

#### PUT /rfps/{id}/responses/{response_id}/reject

Reject RFP response (Buyers only).

**Request Body:**

```json
{
  "reason": "Budget exceeds our requirements"
}
```

### 4. Document Management

#### POST /documents/upload

Upload document file.

**Request Body:** FormData with file and metadata.

**Response:**

```json
{
  "success": true,
  "document": {
    "id": "uuid",
    "filename": "proposal.pdf",
    "size": 1024000,
    "url": "https://storage.example.com/proposal.pdf",
    "uploaded_at": "2024-12-19T14:20:00Z"
  }
}
```

#### GET /documents/{id}

Get document metadata.

**Response:**

```json
{
  "document": {
    "id": "uuid",
    "filename": "proposal.pdf",
    "size": 1024000,
    "url": "https://storage.example.com/proposal.pdf",
    "uploaded_by": "user_uuid",
    "uploaded_at": "2024-12-19T14:20:00Z"
  }
}
```

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🚨 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "title",
      "issue": "Title is required"
    }
  }
}
```

## 🔒 Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **RFP endpoints**: 100 requests per hour
- **Document endpoints**: 50 requests per hour

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads are limited to 10MB per file
- JWT tokens expire after 24 hours
- Pagination defaults: page 1, 20 items per page

---

**Last Updated**: December 2024  
**Version**: 1.0.0-alpha  
**Timeline**: 2 Hours MVP
