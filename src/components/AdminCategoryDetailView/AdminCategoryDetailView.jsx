import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import AddEditForm from "../AdminAddEditForm/AdminAddEditForm";

import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function AdminCategoryDetailView() {

    // hooks
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();

    // selectors
    const selectedAgeRange = useSelector(store => store.selectedAgeRange);
    const detailContent = useSelector(store => store.categoryDetail);
	const resourceToEdit = useSelector(store => store.resourceToEdit);

    useEffect(() => {
        dispatch({
            type: 'FETCH_SPECIFIC_CATEGORY_DETAIL',
            payload: {
                catId: params.catId,
                ageId: params.ageId,
				sectionName: params.sectionName
            }
        })
    }, [params]);

    // MUI Breadcrumbs
    const breadcrumbs = [
        <Link underline="hover" 
        key="1" color="inherit" 
        href="/">
          Admin
        </Link>,
        <Link
          underline="hover"
          key="2"
          color="inherit"
          href="/#/adminprevcare"
        >
          Preventative Care
        </Link>,
        // <Link
        //   underline="hover"
        //   key="2"
        //   color="inherit"
        //   href={`/#/adminprevcare/${params.catId}/ages/${params.ageId}`}
        // >
        //   Age Range {selectedAgeRange.low} - {selectedAgeRange.high}
        // </Link>,
		<Typography key="3" color="text.primary">
			Age Range {selectedAgeRange.low} - {selectedAgeRange.high}
		</Typography>,
        <Typography key="3" color="text.primary">
            Category: {params.sectionName}
        </Typography>,
      ];

    return (
        <>
        {/* MUI Breadcrumbs */}
        <Stack spacing={2}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
        </Stack>

        <h1>{params.sectionName}</h1>
        <section>
			<ul>
				{detailContent[0] && detailContent.map(x => (
					x.id === resourceToEdit.id ? 

					// addEditForm
					<AddEditForm key={x.id} />
					: 
					<li key={x.id}>{x.field01} | {x.field02}
						<button 
						onClick={()=>dispatch({type: 'SET_RESOURCE_TO_EDIT', payload: x})}>
							Edit
						</button>
						<button 
						onClick={(evt)=>{handleDelete(evt, x)}}>
							Delete
						</button>
					</li>
				))}
			</ul>
        </section>
        </>
    );
}

export default AdminCategoryDetailView;