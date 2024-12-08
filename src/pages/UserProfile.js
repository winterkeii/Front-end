import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function UserProfile() {
  const { user } = useContext(UserContext);

  
  const [showModal, setShowModal] = useState(false);

  
  const [userDetails, setUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch user details
  const showUserDetails = () => {
    fetch("http://localhost:4000/users/details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "USER-FOUND") {
          setUserDetails(data.result);
          // Pre-fill form fields with fetched data
          setFirstName(data.result.firstName || "");
          setMiddleName(data.result.middleName || "");
          setLastName(data.result.lastName || "");
          setEmail(data.result.email || "");
          setContactNumber(data.result.contactNumber || "");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An unexpected error occurred.");
      });
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    showUserDetails();
  }, []);

  // Function to toggle modal visibility
  const toggleModal = () => setShowModal(!showModal);

  // Function to update user details
  const updateUserDetails = () => {
    const updatedData = {
      firstName,
      middleName,
      lastName,
      email, 
      contactNumber,
      ...(password && { password }),
      isAdmin
    };

    fetch("http://localhost:4000/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "USER-UPDATE-SUCCESS") {
          Swal.fire({
            title: "SUCCESS!",
            text: data.message,
            icon: "success",
          });
          toggleModal(); // Close modal on success
          showUserDetails(); // Refresh user details
        } else {
          Swal.fire({
            title: "SOMETHING WENT WRONG!",
            text: data.message,
            icon: "error",
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    updateUserDetails();
    setIsSubmitting(false);
  };

  return (
    <Container>
       
      <Row className="justify-content-center">
        <Col lg={6}>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : userDetails ? (
            <Card className="my-3">
                 <h1 className="mx-3 my-3">Profile</h1>
              <Card.Body>
                <Card.Title>User ID</Card.Title>
                <Card.Text>{userDetails._id}</Card.Text>
                <Card.Title>Name</Card.Title>
                <Card.Text>{`${userDetails.firstName} ${userDetails.middleName} ${userDetails.lastName}`}</Card.Text>
                <Card.Title>Email</Card.Title>
                <Card.Text>{userDetails.email}</Card.Text>
                <Card.Title>Contact Number</Card.Title>
                <Card.Text>{userDetails.contactNumber}</Card.Text>
                <Card.Title>Role</Card.Title>
                <Card.Text>{userDetails.isAdmin ? "Admin" : "User"}</Card.Text>
              </Card.Body>
            </Card>
          ):<></>}

          <Button variant="primary" className="my-3" onClick={toggleModal}>
            Edit Profile
          </Button>
        </Col>
      </Row>

      {/* Modal for editing user profile */}
      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="middleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password (Optional)</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

                        <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role (Admin)</Form.Label>
            <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin} // Bind the checkbox state to `isAdmin`
                onChange={(e) => setIsAdmin(e.target.checked)} // Update state with the checkbox value
            />
            </Form.Group>


            <Button
              variant="warning"
              className="w-100"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
