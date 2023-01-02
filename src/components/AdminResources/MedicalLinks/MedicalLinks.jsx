import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./MedicalLinks.css";
import MedicalLinksAccordion from "./MedicalLinksAccordion";
import EditMedicalLinksAccordion from './EditMedicalLinksAccordion';
import { Typography } from "@mui/material";

function MedicalLinks() {
  const dispatch = useDispatch();
  const addMedLinks = useSelector((store) => store.addMedicalLinks);
  const medicallinks = useSelector((store) => store.medicallinks);
  const resourceToEdit = useSelector((store) => store.resourceToEdit);

  const [result, setResult] = useState([addMedLinks.logo_url]);
  const [selected, setSelected] = useState(addMedLinks.logo_url);

  const handleAddMedLink = () => {
   
    dispatch({
      type: "ADD_MEDICAL_LINK",
      payload: {
        name: addMedLinks.title,
        link: addMedLinks.url,
        logo_url: addMedLinks.logo_url,
        description: addMedLinks.description,
      },
    });

    dispatch({type:'CLEAR_ADD_MEDICAL_LINKS'});
  };

  useEffect(() => {
    console.log("medical links useeffect ran");
    //fetch all medical links from database
    //dispatch someting

    dispatch({ type: "FETCH_MEDICAL_LINKS" });
  }, []);

  

  let imgpath = "./images/vifidefault.jpeg";
  let noImagePath = "";

  return (
    <Box>
      <Typography variant="h5">Add New Medical Link</Typography>
      <Grid container >
        <Grid item xs={12} my={1}>
          <Accordion
          expanded>
            <AccordionSummary >
              <Grid container columnSpacing={1}>
                <Grid item xs={1} className="centerthis">
                  <img src={selected} />
                </Grid>
                <Grid item xs={4} px={1} className="centerthis">
                  <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={addMedLinks.title}
                    onChange={(event) =>
                      dispatch({
                        type: "SET_MEDICAL_TITLE",
                        payload: event.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={7} className="centerthis">
                  <TextField
                    label="Url"
                    variant="outlined"
                    fullWidth
                    value={addMedLinks.url}
                    onChange={(event) =>
                      dispatch({
                        type: "SET_MEDICAL_URL",
                        payload: event.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={11}>
                <TextField
                  variant="outlined"
                  label="description"
                  fullWidth
                  multiline
                  maxRows={4}
                  value={addMedLinks.description}
                  onChange={(event) =>
                    dispatch({
                      type: "SET_MEDICAL_DESCRIPTION",
                      payload: event.target.value,
                    })
                  }
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid container>
          <Grid item xs={2}>
            <select
              className="dropdown"
              defaultValue={result[0]}
              onChange={(e) => {
                setSelected(e.target.value);
                dispatch({
                  type: "SET_MEDICAL_LOGO_URL",
                  payload: e.target.value,
                });
              }}
            >
              <option key={'sdfs'} disabled>Choose One</option>
              <option key={noImagePath}>{noImagePath}</option>
              <option key={imgpath}>{imgpath}</option>
              {result.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </Grid>
          <Grid item xs={5}>
            <Button
            sx={{color:'#8EBBA7'}}
              onClick={async () => {
                const url = new URL(addMedLinks.url);
                console.log(url.hostname);
                const result = await axios.get(
                  `https://favicongrabber.com/api/grab/${url.hostname}`
                );
                setResult(result.data.icons.map((icon) => icon.src));
                console.log(result.data.icons.map((icon) => icon.src));
              }}
            >
              get icons
            </Button>
          </Grid>
          <Grid item xs={5} textAlign={"end"}>
            <Button variant="contained" onClick={handleAddMedLink}>Add Medical Link</Button>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{mx:2,marginTop:10}}>
        <Typography variant="h3"> Medical Links </Typography>
      {/* render all medical links from database */}
      {medicallinks.map((medlink) =>
        medlink.id === resourceToEdit.id ? (
          <EditMedicalLinksAccordion key={medlink.id} medLinkToEdit={medlink} />
        ) : (
          <MedicalLinksAccordion key={medlink.id} medicallink={medlink} />
        )
      )}
      </Box>
    </Box>
  );
}

export default MedicalLinks;