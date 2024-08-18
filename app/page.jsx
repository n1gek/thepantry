'use client';
import {Box, Stack, Button, Typography, TextField, styled, Modal, MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import { firestore } from './firebase';
import { useState, useEffect } from'react';
import { getDocs, collection, query, getDoc, setDoc, doc, deleteDoc} from 'firebase/firestore';

const ItemBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& img': {
    width: '60%',
    height: '60%',
    objectFit: 'cover',
    borderRadius: '10%', 
    display: 'block', 
    margin: 0 // Optional: adds a margin below the image
  },
}));

const style = {
  position: 'absolute',
  top: '30%',
  left: '25%',
  width: '30%',
  height: '30%',
  bgcolor: '#e6e6fa',
  border: '2px solid',
  p: 4,
}


export default function Home() {

  const [pantrylist, setPantryList] = useState([]);
  // const [itemname, setItemname] = useState('');

  const [ingredientList, setIngredientList] = useState([]);

  const [openAddItem, setOpenAddItem] = useState(false);
  const handleOpen = () => setOpenAddItem(true);
  const handleClose = () => setOpenAddItem(false);

  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState();

  const [SearchQuery, setSearchQuery] = useState('');

  const [openRecipe, setOpenRecipe] = useState(false);
  const handleRecipeOpen = () => setOpenRecipe(true);
  const handleRecipeClose = () => setOpenRecipe(false);

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleIngredientChange = (event) => {
    setSelectedIngredients(event.target.value);
    console.log(selectedIngredients);
  }

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchRecipe = async () => {
    setLoading(true);
    const recipeIngredients = selectedIngredients.map(ingredient => ingredient.trim()).join(', ');
      console.log(recipeIngredients);
    
      try {
        const response = await fetch('../api/server', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingredients: recipeIngredients.split(', ') }), 
        });
    
        const data = await response.json();
        if (response.ok) {
          setRecipe(data.recipe);
          handleRecipeOpen();
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
  };

  const [ingredientImages, setIngredientImages] = useState({});

// const fetchImage = async (itemName) => {
//     if (!ingredientImages[itemName]) {
//         try {
//             const response = await fetch('../api/image', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ ingredient: itemName }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setIngredientImages(prev => ({ ...prev, [itemName]: data.imageUrl }));
//             } else {
//                 console.error('Failed to fetch image:', await response.text());
//             }
//         } catch (error) {
//             console.error('Fetch error:', error);
//         }
//     }
// };


  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(firestore, 'pantry'));
      const ingredients = snapshot.docs.map(doc => doc.id)
      setIngredientList(ingredients);
    };
    fetchIngredients();
  },[]);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      pantryList.push({
        name: doc.id,
        quantity: data.item ? data.item: 0,
      })
    });
    setPantryList(pantryList);
  }
  useEffect(() =>{
    updatePantry();
  }, []);

  const increement = async (name) => {
    const docRef = doc(collection(firestore, 'pantry'), name);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const updatedQuantity = (data.item || 0) + 1;
    await setDoc(docRef, { item: updatedQuantity });
    updatePantry();
  }

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, 'pantry'), name);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if (data.item < 2) {
      deleteDoc(docRef);
    }
    else{
      const newCount  = data.item - 1;
      await setDoc(docRef, {item: newCount});
    }
    updatePantry();
  }

  const addItem = async (name, quantity) => {
    // Create a reference to the document in the pantry!!
    const docRef = doc(collection(firestore, 'pantry'), name);
    //get the current document information
    const docSnap = await getDoc(docRef);

    //Convert the quantity to a number/integer
    const quan = parseInt(quantity);
    const data = docSnap.data();
    //We also wanna double check if the item already exists in the pantry
    if (!docSnap.exists()) {
      await setDoc(docRef, { item: quan });
    } else {
      //well if it does, we increment the quantity!!!
      const data = docSnap.data();

      const updatedQuantity = (data.item || 0) + quan;
      await setDoc(docRef, { item: updatedQuantity });
    }
    setItemName('');
    setItemQuantity('');

    //After updating, we need to update the pantry list <DO NOT FORGET ALWAYS!!!>
    updatePantry();
  }
  const filteredPantryList = pantrylist.filter(item => item.name.toLowerCase().includes(SearchQuery.toLocaleLowerCase()));

  return (
    <Box  flexDirection={{ xs: 'column', md: 'row' }} width='100%' height='100vh' display="flex" position="relative" overflow='hidden'>

      <Box width={"20%"} bgcolor={'#967bb6'}>
        <Stack mt={10} padding={3} direction={'column'} spacing={2} marginTop={5}>
          <ItemBox alignContent={'center'}> 
            <img src="icon1.jpeg"/></ItemBox>
            <Button variant='contained' sx={{color: 'white', fontSize: '1.2rem'}} startIcon={<HomeIcon color="secondary"/>}> Pantry</Button>

            <Button  variant='contained' onClick={handleOpen} sx={{color: 'white', fontSize: '1.2rem'}} startIcon={<AddIcon fontSize='large' color='success'/>} > Add New Item</Button>
            <Modal open={openAddItem} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" alignContent={'center'} component="h2">
                  Add a New Item
                </Typography>
                <Stack direction={'row'} paddingTop={4}>
                  <TextField label={'Item name'} value={itemName} onChange={(e) => setItemName(e.target.value)} ></TextField>
                  <TextField label={'Quantity'} type='number' value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)}></TextField>
                  <Button variant='contained' onClick={() => {addItem(itemName, itemQuantity); handleClose()}} sx={{color: 'white', fontSize: '1rem'}}>Add</Button>
                </Stack>
              </Box>
            </Modal>

            <Button onClick={handleRecipeOpen} variant='contained' sx={{ color:'white', fontSize: '1.2rem'}}>Recipes</Button>
              <Modal open={openRecipe} onClose={handleRecipeClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={{ top: '10%', width: '80%', position: 'relative', left: '10%', height: '80%', border:'2px solid', color:'white', bgcolor:'#50404d', p:4}} overflow={'auto'}>
                  <Typography id="modal-modal-title" variant="h3" align='center' bgcolor={'#bf94e4'} component="h2">
                    Select your ingredients to get a recipe!
                  </Typography>
                  <FormControl fullWidth height='10%'>
                    <InputLabel id="ingredients-label" bgcolor='white'>Select ingredients</InputLabel>
                      <Select multiple label='Ingredients' onChange={handleIngredientChange} value={selectedIngredients}>
                        {ingredientList.map((ingredient) => (
                          <MenuItem key={ingredient} value={ingredient}>{ingredient}</MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                  <Button onClick={fetchRecipe} fullWidth variant='outlined' sx={{color: 'white', fontSize: '2rem'}}>Get Recipe</Button>
                  <Typography variant='h4' color={'white'}>{recipe}</Typography>
                </Box>
              </Modal>

        </Stack>
      </Box>



    <Box flex={1} height={'100%'} overflow={'auto'}>

      <Box padding={{xs: 1, md: 5}} bgcolor={'#483248'}>
        <Stack direction={'row'} width={'100%'}>
          <Typography variant='h3' textAlign={'left'} color={'white'}>Welcome to Your Pantry!</Typography>
          <Box flexGrow={1} textAlign={'right'} mt={15} bgcolor={'whitesmoke'} borderRadius={5} >
            <TextField label="Search item" fullWidth variant="outlined"  value={SearchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </Box>
        </Stack>
      </Box>


      <Box bgcolor={'#dcd0ff'} display={'grid'} gridTemplateColumns={{xs: '2fr', sm: 'repeat(3, 1fr)'}} paddingLeft={10} alignItems={'center'}> 
        {filteredPantryList.map((item) => (
          <ItemBox key={item} padding={5} width={'100%'}>
             <img src='icon2.jpeg'/>
              {/* <img src={ingredientImages[item.name] || 'icon2.jpeg'} onLoad={() => fetchImage(item.name)}/> */}
              <Box width={'60%'} height={'25%'} bgcolor={'#c8a2c8'} borderRadius={3} color={'white'}>
                <Typography variant='h5'>{ item.name.charAt(0).toUpperCase()  + item.name.slice(1)}</Typography>
                <Typography variant='h6'>Quantity: {item.quantity}</Typography>
                <Stack direction={'row'} justifyContent={'space-between'}>
                <Button startIcon={<AddIcon/>} onClick={() => increement(item.name)} sx={{color: 'white'}} variant='text'>Add</Button>
                <Button sx={{marginLeft: 1, color: 'error'}} onClick={() => removeItem(item.name)} color='error' startIcon={<DeleteIcon/>} variant='text'>Delete</Button>
                </Stack>
              </Box>
          </ItemBox>
            ))}
      </Box>


    </Box>
  </Box>
  );
}
