import { useState, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { data } from "react-router-dom";

export default function UserProfile() {
    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [middleName, setMiddleName] = useState(user?.middleName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [contactNumber, setContactNumber] = useState(user?.contactNumber || "");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({
        firstName,
        middleName,
        lastName,
        email,
        contactNumber,
        
      });

    const updateUserDetails = () => {
        fetch("http://localhost:4000/users/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token retrieval method
            },
            body: JSON.stringify({
                firstName,
                middleName,
                lastName,
                email,
                contactNumber,
                password
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Server Response:", data);
                if (data.code === "USER-UPDATE-SUCCESS") {
                    Swal.fire({
                        title: "SUCCESS!",
                        text: data.message,
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "SOMETHING WENT WRONG!",
                        text: data.message,
                        icon: "error"
                    });
                }
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        console.log("Form Data:", { firstName, middleName, lastName, email, contactNumber, password });
        updateUserDetails();
        setIsSubmitting(false);
    };
    console.log("User Data:", user);

    return (
        <Container className="d-flex flex-column col-lg-6 col-12">
            <Row>
                <Col>
                    <Container fluid className="p-5 d-flex flex-column align-items-center justify-content-center">
                        <Form
                            className="w-100 p-5 shadow rounded-3 border-bottom border-3 border-warning"
                            onSubmit={handleSubmit}
                        >
                            <h1>Edit Profile</h1>

                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    required onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="middleName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your middle name"
                                    value={middleName}
                                    required onChange={(e) => setMiddleName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lastName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    required onChange={(e) => setLastName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    required onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="contactNumber">
                                <Form.Control
                                    type="number"
                                    placeholder="Enter your mobile number"
                                    value={contactNumber}
                                    required onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    required onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="submit">
                                <Button
                                    variant="warning"
                                    className="w-100 rounded-pill"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
