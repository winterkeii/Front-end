import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgLink, setImgLink] = useState("");
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetch("http://localhost:4000/users/details", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "USER-FOUND") {
          setUserDetails(data.result);
          setFirstName(data.result.firstName || "");
          setMiddleName(data.result.middleName || "");
          setLastName(data.result.lastName || "");
          setEmail(data.result.email || "");
          setContactNumber(data.result.contactNumber || "");
          setIsAdmin(data.result.isAdmin || "");
          setImgLink(data.result.imgLink || "");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => setError("An unexpected error occurred."));
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password && password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match.",
        icon: "error",
      });
      return;
    }

    const updatedData = {
      _id: userDetails._id,
      firstName,
      middleName,
      lastName,
      email,
      contactNumber,
      imgLink,
      ...(password && { password }),
      isAdmin,
    };

    setIsSubmitting(true);
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
          toggleModal();
          setUserDetails(updatedData);
        } else {
          Swal.fire({
            title: "ERROR!",
            text: data.message,
            icon: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return user.id === null ? (
    <Navigate to="/" />
  ) : (
    <Container id="profile-con" className="p-4">
      <Row className="justify-content-center">
        <Col lg={6}>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : userDetails ? (
            <Card className="shadow rounded-3 border-0">
              <Card.Header className="bg-primary text-white text-center">
                <h2 className="mb-0">Your Profile</h2>
              </Card.Header>
              <Card.Body>
              <Card.Img
                  variant="top"
                  src={imgLink || "https://cdn-icons-png.flaticon.com/512/147/147144.png"} 
                  onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/512/147/147144.png")} 
                  className="center-crop mb-3"
                  style={{ borderRadius: "50%", maxWidth: "150px", margin: "0 auto", display: "block" }}
                />
                <Card.Title>User Details</Card.Title>
                <Card.Text><strong>User ID:</strong> {userDetails._id}</Card.Text>
                <Card.Text><strong>Name:</strong> {`${firstName} ${middleName} ${lastName}`}</Card.Text>
                <Card.Text><strong>Email:</strong> {email}</Card.Text>
                <Card.Text><strong>Contact:</strong> {contactNumber}</Card.Text>
                <Card.Text>
                  <strong>Role:</strong> {isAdmin ? "Admin" : "User"}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button variant="warning" onClick={toggleModal}>
                  Edit Profile
                </Button>
              </Card.Footer>
            </Card>
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="imgLink">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imgLink}
                onChange={(e) => setImgLink(e.target.value)}
                placeholder="Enter image URL"
              />
            </Form.Group>
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
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </Form.Group>
            <Button
              variant="primary"
              className="w-100"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
