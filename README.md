# Product Management App

A modern product management application built with Next.js 14, focusing on efficient product management with features like real-time search, category filtering, and complete CRUD operations. The application demonstrates modern React patterns with server and client components, RTK Query for state management, and a responsive UI with Tailwind CSS.

## ✨ Key Features

### Authentication
- Protected routes with JWT token-based authentication
- Persistent sessions with local storage
- Client-side route protection

### Product Management
- **Browse Products**: 
  - Paginated product listing
  - Responsive grid layout
  - Category-based filtering
  - Real-time search with debouncing
- **Product Operations**:
  - Create new products with image URLs
  - Update existing product information
  - Delete products with confirmation
  - View detailed product information
- **Smart Caching**:
  - RTK Query cache management
  - Optimistic updates
  - Automatic cache invalidation

### User Experience
- Responsive design across all devices
- Form validation with Zod
- Loading states and error handling
- Toast notifications for actions
- Modal-based operations

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **Icons**: React Icons
- **UI Components**: Custom components

## � Getting Started

Before running this project, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Valid email for API authentication

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayve-178/product-management-app.git
   cd product-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api-url-here.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
product-management-app/
├── app/
│   ├── auth/
│   │   └── sign-in/        # Authentication pages
│   ├── product/
│   │   └── [slug]/         # Single product page
│   ├── products/           # Products listing page
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── auth/              # Auth components
│   ├── layout/            # Layout components
│   └── products/          # Product-related components
├── src/
│   └── redux/
│       ├── store.ts       # Redux store configuration
│       └── api/
│           └── apiSlice.ts # RTK Query API definitions
├── styles/
│   └── globals.css        # Global styles
└── public/                # Static assets
```

## 🔑 Features in Detail

### Products Page
- Responsive grid layout
- Category filtering dropdown
- Real-time search with debouncing
- Pagination with dynamic page numbers
- Add new product button
- Product cards with image preview

### Single Product Page
- Large product image display
- Image gallery for multiple images
- Product details section
- Update and delete actions
- Category information
- Price display

### Product Modal
- Create/Update forms
- Image URL management
- Zod validation
- Category selection
- Loading states
- Error handling

## 🎨 UI Components

### Product Card
- Responsive image container
- Product name and description
- Price display
- View details action
- Category badge

### Modals
- Product creation/update modal
- Delete confirmation modal
- Form validation feedback
- Loading states

## 🔒 Authentication

The application uses JWT token-based authentication:
- Token storage in localStorage
- Protected API routes
- Automatic token inclusion in requests
- Session persistence
- Secure logout

## 🌐 API Integration

Integrated with RESTful API endpoints:
- Authentication: `POST /auth`
- Products:
  - List: `GET /products`
  - Single: `GET /products/:slug`
  - Create: `POST /products`
  - Update: `PUT /products/:id`
  - Delete: `DELETE /products/:id`
- Categories: `GET /categories`

## 🧪 Validation

Form validation using Zod:
- Required fields
- Type validation
- URL validation for images
- Price validation
- Custom error messages

## 🎯 Future Enhancements

- [ ] Image upload functionality
- [ ] Advanced filtering options
- [ ] Bulk actions
- [ ] Product analytics
- [ ] User roles and permissions
- [ ] Theme customization

## � License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
