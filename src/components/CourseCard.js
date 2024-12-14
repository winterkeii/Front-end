import { useContext, useEffect, useState } from "react";
import { Card, Button, CardText, Form, Modal, FormLabel } from "react-bootstrap";
import { data } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";


export default function CourseCard({coursesData, usersData}){

  const { _id, imgLink, name, description, price, isActive} = coursesData;
  const { user } = useContext(UserContext);

  const [courseupdate, setcourseupdate] = useState({
    imgLink, name, price, description, isActive
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  const updatecourse = () => {
    fetch(`http://localhost:4000/courses/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id,...courseupdate }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.code === "COURSE-UPDATED-SUCCESSFULLY") {
          Swal.fire({
            title: "SUCCESS!",
            text: data.message,
            icon: "success",
          });
          setShowEditModal(false);

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


  const deletecourse = (_id) => {
    fetch(`http://localhost:4000/courses/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: coursesData })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.code === "COURSE-DELETED-SUCCESSFULLY") {
          Swal.fire({
            title: "SUCCESS!",
            text: data.message,
            icon: "success",
          });
          setShowEditModal(false);
      
          
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
  
  const handleSubmit = (event) => {
    event.preventDefault();
    updatecourse()
    setIsSubmitting(true);
  };
  
  

    return(
    <Card className="w-100 card-height mx-2 my-2 p-2 shadow">
      <Card.Img variant="top" src={imgLink} className="center-crop"/>
      <Card.Body>

        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {description}
        </Card.Text>
        <Card.Subtitle>Price</Card.Subtitle>
        <Card.Text>
          {price}
        </Card.Text>
       
        {user && user.isAdmin ? (
          <>
            <CardText>{_id}</CardText>
            <Card.Subtitle>Status</Card.Subtitle>
            <Card.Text>{isActive ? "Active" : "Inactive"}</Card.Text>
            <Card.Footer>
              <Button variant="primary" className="w-100 rounded-pill"  onClick={() => setShowEditModal(true)}>
                Update
              </Button>
              <Button variant="danger" className="w-100 rounded-pill mt-2"  onClick={() =>deletecourse()}
             >
               Remove
              </Button>
            </Card.Footer>
          </>
        ) : (
          <Card.Footer>
            <Button variant="primary" className="w-100 rounded-pill">
              Enroll
            </Button>
          </Card.Footer>
        )}
         <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)} 
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="imgLink">
              <Form.Label>Course Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imgLink}
                onChange={(e) => setcourseupdate({...courseupdate, imgLink: e.target.value})}
                placeholder="Enter image URL"
              />
            </Form.Group>
              <Form.Group className="mb-3" controlId="Name">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  value={courseupdate.name}
                  onChange={(e) =>
                    setcourseupdate({ ...courseupdate, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={courseupdate.description}
                  onChange={(e) =>
                    setcourseupdate({ ...courseupdate, description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  value={courseupdate.price}
                  onChange={(e) =>
                    setcourseupdate({ ...courseupdate, price: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="isActive">
              
                <Form.Check
                type="checkbox"
                  label="Active"
                  checked={courseupdate.isActive}
                  onChange={(e) =>
                    setcourseupdate({ ...courseupdate, isActive: e.target.checked })
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
      </Card.Body>
    </Card>
    
    )
    
}