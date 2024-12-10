import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { data } from "react-router-dom";
import UserContext from "../UserContext";


export default function CourseCard({coursesData}){

  const { _id, imgLink, name, description, price} = coursesData;


  const [userDetails, setUserDetails] = useState(null);
  
  

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
        <Card.Footer>
        <Button variant="primary" className="w-100 rounded-pill">Enroll</Button>
        <Button variant="danger" className="w-100 rounded-pill mt-2">Delete</Button>
        </Card.Footer>
      </Card.Body>
    </Card>
    )
}