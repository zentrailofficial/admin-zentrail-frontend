import Layout1 from "../layouts/Layout1";
import Layout2 from "../layouts/Layout2";
import RoutingList from "../components/RoutingList";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PublicRoute from "../components/PublicRoute";
import Blog from "../pages/Blogs/listing";
import AddBlogs from "../pages/Blogs/AddBlog";
import EditBlog from "../pages/Blogs/Edit";
import CategoryList from "../pages/Category/CategoryList";
import AddCategory from "../pages/Category/AddCategory";
import EditCategory from "../pages/Category/EditCategory";
import PortfolioPage from "../pages/Portfolio/Portfolio";
import AddPortfolioPage from "../pages/Portfolio/AddPortfolioPage";
import CategoryServicesList from "../pages/CategoryServices/CategoryServicesList";
import CreateCategoryServices from "../pages/CategoryServices/CreateCategoryServices";
import EditCategoryServices from "../pages/CategoryServices/EditCategoryServices";
import AddServices from "../pages/Services/AddServices";
import ServicesList from "../pages/Services/ServicesList";
import EditService from "../pages/Services/editService";
import Leads from "../pages/Leads";
import ListingTravelPackage from "../pages/TravelPackage/ListingTravelPackage";
import AddTravelPackage from "../pages/TravelPackage/AddTravelPackage";
import EditTravelPackage from "../pages/TravelPackage/EditTravelPackage";
import AddSubCategory from "../pages/SubCategory/AddSubCategory";
import ListSubCategory from "../pages/SubCategory/ListSubCategory";
import EditSubCategory from "../pages/SubCategory/EditSubCategory";
import Listing from "../pages/Role/Listing";
import AddRole from "../pages/Role/AddRole";
import EditRole from "../pages/Role/EditRole";
const routesConfig = [
  {
    element: <Layout1 />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <RoutingList Component={Login} />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <RoutingList Component={Dashboard} />,
      },
      {
        path: "/blog",
        element: <RoutingList Component={Blog} />,
      },
      {
        path: "/createblogs",
        element: <RoutingList Component={AddBlogs} />,
      },
      {
        path: "/editblog/:id",
        element: <RoutingList Component={EditBlog} />,
      },
      
    ],
  },
   {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/services",
        element: <RoutingList Component={ServicesList} />,
      },
      {
        path: "/addservices",
        element: <RoutingList Component={AddServices} />,
      },
        {
        path: "/editservices/:id",
        element: <RoutingList Component={EditService} />,
      },
      {
        path: "/categoryedit/:id",
        element: <RoutingList Component={EditCategory} />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/category",
        element: <RoutingList Component={CategoryList} />,
      },
      {
        path: "/categoryadd",
        element: <RoutingList Component={AddCategory} />,
      },
      {
        path: "/categoryedit/:id",
        element: <RoutingList Component={EditCategory} />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/portfolio",
        element: <RoutingList Component={PortfolioPage} />,
      },
      {
        path: "/addportfolio",
        element: <RoutingList Component={AddPortfolioPage} />,
      },
      // {
      //   path: "/categoryedit/:id",
      //   element: <RoutingList Component={EditCategory} />,
      // },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/categoryservices",
        element: <RoutingList Component={CategoryServicesList} />,
      },
      {
        path: "/createcategoryservices",
        element: <RoutingList Component={CreateCategoryServices} />,
      },
      {
        path: "/editcategoryservices/:id",
        element: <RoutingList Component={EditCategoryServices} />,
      },
      {
        path: "/addsubcategory",
        element: <RoutingList Component={AddSubCategory} />,
      },
      {
        path: "/listsubcategory",
        element: <RoutingList Component={ListSubCategory} />,
      },
        {
        path: "/editsubcategory/:id",
        element: <RoutingList Component={EditSubCategory} />,
      },
    ],
  },
    {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/leads",
        element: <RoutingList Component={Leads} />,
      },

    ],
  },
   {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/travelpackage",
        element: <RoutingList Component={ListingTravelPackage} />,
      },
      {
        path: "/addtour",
        element: <RoutingList Component={AddTravelPackage} />,
      },
      {
        path: "/edittour/:id",
        element: <RoutingList Component={EditTravelPackage} />,
      },
      // {
      //   path: "/categoryedit/:id",
      //   element: <RoutingList Component={EditCategory} />,
      // },
    ],
  },
   {
    element: (
      <ProtectedRoute>
        <Layout2 />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/role",
        element: <RoutingList Component={Listing} />,
      },
      {
        path: "/addrole",
        element: <RoutingList Component={AddRole} />,
      },
      {
        path: "/editrole/:id",
        element: <RoutingList Component={EditRole} />,
      },
      // {
      //   path: "/categoryedit/:id",
      //   element: <RoutingList Component={EditCategory} />,
      // },
    ],
  },
];

export default routesConfig;
