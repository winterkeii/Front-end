import { useContext, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function UserCard({ usersData, refreshUsers }) {
    const { _id, imgLink,firstName, middleName, lastName, email,password, contactNumber, isAdmin } = usersData;
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const { user } = useContext(UserContext);
  
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({
      imgLink,
        firstName,
      middleName,
      lastName,
      email,
      contactNumber,
      password,
      isAdmin,
    });
  
   
    const updateUserDetails = () => {
        fetch(`http://localhost:4000/users/update-user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ _id, ...updatedDetails }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
            if (data.code === "USER-UPDATE-SUCCESS") {
              Swal.fire({
                title: "SUCCESS!",
                text: data.message,
                icon: "success",
              });
              setShowEditModal(false);
              if (typeof refreshUsers === "function") {
                refreshUsers(); 
              }
            } else {
              Swal.fire({
                title: "SOMETHING WENT WRONG!",
                text: data.message,
                icon: "error",
              });
            }
          })
          .catch((error) => console.error("Error updating user:", error));
      };


      const deleteUser = (userId) => {
        fetch(`http://localhost:4000/users/delete-user`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ _id: usersData })
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
            if (data.code === "USER-DELETED-SUCCESS") {
              Swal.fire({
                title: "SUCCESS!",
                text: data.message,
                icon: "success",
              });
              setShowEditModal(false);
              if (typeof refreshUsers === "function") {
                refreshUsers(); 
              }
            } else {
              Swal.fire({
                title: "SOMETHING WENT WRONG!",
                text: data.message,
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            Swal.fire({
              title: "ERROR!",
              text: "An error occurred while deleting the user.",
              icon: "error",
            });
          });
      };
      
      
    // Handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      updateUserDetails();
    
      setIsSubmitting(false);
    };
  
    return (
      <>
        <Card className="w-100 card-height mx-2 my-2 p-2 shadow">
          <Card.Body>
          <Card.Img
                  variant="top"
                  src={imgLink || "https://cdn-icons-png.flaticon.com/512/5095/5095023.png"} 
                  onError={(e) => (e.target.src = "")}
                  className="center-crop mb-3"
                  style={{ borderRadius: "50%", maxWidth: "150px", margin: "0 auto", display: "block" }}
                />
            <Card.Title>User ID</Card.Title>
            <Card.Text>{_id}</Card.Text>
            <Card.Title>Name</Card.Title>
            <Card.Text>{fullName}</Card.Text>
            <Card.Title>Email</Card.Title>
            <Card.Text>{email}</Card.Text>
            <Card.Title>Contact Number</Card.Title>
            <Card.Text>{contactNumber}</Card.Text>
            <Card.Title>Role</Card.Title>
            <Card.Text>{isAdmin ? "Admin" : "User"}</Card.Text>
            <Card.Footer>
    
                <>
                  <Button
                    variant="primary"
                    className="w-100 rounded-pill"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="w-100 rounded-pill mt-2"
                    onClick={() =>deleteUser()
                     
                    }
                  >
                    Delete
                  </Button>
                </>
              
            </Card.Footer>
          </Card.Body>
        </Card>
  
       
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)} 
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="imgLink">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imgLink}
                onChange={(e) => setUpdatedDetails({...updatedDetails, imgLink: e.target.value})}
                placeholder="Enter image URL"
              />
            </Form.Group>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedDetails.firstName}
                  onChange={(e) =>
                    setUpdatedDetails({ ...updatedDetails, firstName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="middleName">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedDetails.middleName}
                  onChange={(e) =>
                    setUpdatedDetails({ ...updatedDetails, middleName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedDetails.lastName}
                  onChange={(e) =>
                    setUpdatedDetails({ ...updatedDetails, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={updatedDetails.email}
                  onChange={(e) =>
                    setUpdatedDetails({ ...updatedDetails, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="contactNumber">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedDetails.contactNumber}
                  onChange={(e) =>
                    setUpdatedDetails({
                      ...updatedDetails,
                      contactNumber: e.target.value,
                    })
                  }
                />
                 <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password (Optional)</Form.Label>
              <Form.Control
                type="password"
                value={updatedDetails.password}
                onChange={(e) => setUpdatedDetails({
                    ...updatedDetails,
                    password: e.target.value,
                  })}
              />
            </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3" controlId="isAdmin">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={updatedDetails.isAdmin}
                  onChange={(e) =>
                    setUpdatedDetails({ ...updatedDetails, isAdmin: e.target.checked })
                  }
                />
              </Form.Group>
              <Button
                variant="warning"
                className="w-100 rounded-pill"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
  