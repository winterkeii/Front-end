import { useContext, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";



export default function Login(){

    const {user, setUser} = useContext(UserContext);

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    function loginUser(e){
        e.preventDefault();

        fetch("http://localhost:4000/users/login", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(result => result.json())
        .then(result => {
            if(result.token){
                Swal.fire({
                    title: "LOGIN SUCCESS!",
                    text: "You can now use our enrollment system",
                    icon: "success"
                })
                if(typeof result.token !== "undefined"){
                    localStorage.setItem("token", result.token);
                    retrieveUserDetails(result.token);
                }

            }else if(result.code === "USER-NOT-REGISTERED"){
                Swal.fire({
                    title: "YOU ARE NOT REGISTERED",
                    text: "Please register to login",
                    icon: "warning"
                })
            }else{
                Swal.fire({
                    title: "INCORRECT PASSWORD!",
                    text: "Please try again",
                    icon: "error"
                })
            }
        })
    }

    const retrieveUserDetails = (token) => {
        fetch("http://localhost:4000/users/details", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(result => result.json())
        .then(data => {
            console.log(data);
            setUser({
                id: data.result._id,
                isAdmin: data.result.isAdmin
            })
        })
    }

    return(
        user.id !== null ?
        <Navigate to="/"/>
        :
        <Container fluid className="vh-100">
  <Row className="h-100 g-0">
    {/* Left Column */}
    <Col
      xs={12}
      md={6}
      className="bg-warning d-flex flex-column align-items-center justify-content-center text-center py-5"
    >
      <h1 className="display-6 fw-bold">CAN'T WAIT FOR YOU TO LOGIN!</h1>
      <p className="lead">Your Bright Future Begins Here!</p>
    </Col>

    {/* Right Column */}
    <Col
      xs={12}
      md={6}
      className="d-flex flex-column align-items-center justify-content-center py-5"
    >
      <Container
        className="p-4 shadow rounded-3 border-bottom border-3 border-warning w-100"
        style={{ maxWidth: "400px" }}
      >
        <h1 className="display-6 fw-bold mb-4 text-center">LOGIN</h1>

        <Form onSubmit={(e) => loginUser(e)}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Button
              variant="warning"
              className="w-100 rounded-pill"
              type="submit"
            >
              Login
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </Col>
  </Row>
</Container>

    );
}