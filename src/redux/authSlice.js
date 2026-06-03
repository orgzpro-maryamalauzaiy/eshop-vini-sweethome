import { useNavigate } from 'react-router-dom';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

let initialState = {
    error: false,
    errorMessage: "",
    userInfo: null,
    userEmail: null
}

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL
const LOCAL_URL = process.env.REACT_APP_LOCAL_URL

// const initialState = {
//   entities: [],
//   loading: false,
// }

export const login = createAsyncThunk(
  '/auth/login',
  async (data) => {
    await axios.post(`${BASE_URL}/auth/login`, data)
          .then(result => {
            console.log('result', result.data.data)
            Cookies.set('token', result.data.data.token)
            return result.data.data
            // if(result.status === 200){

            //   // Cookies.set('token', result.data.data.token)
            //   this.iniatialState.userInfo = {
            //     username: result.data.data.username,
            //     full_name: result.data.data.full_name,
            //   }
            //   this.initialState.orgzInfo.orgz_id= result.data.data.orgz_id
            //   this.initialState.orgzInfo.orgz_name= result.data.data.orgz_id
            //   //   ,
            //   //   org_name: result.data.data.orgz_name,
            //   // }
            //   // toast('Alhamdulillah, Anda berhasil login.')
            //   return result.data.data
            // }
          })
          .catch(error => {
            // console.log(error)
            // toast('Afwan, Error ketika login.')
            // this.state.error = true
            // this.state.errorMessage = 'Persist login error: ' + error

          })
    // const res = await fetch(`${BASE_URL}/api/auth/login`).then(
    //   (data) => data.json()
    // )
    // return res
})

export const getSession = createAsyncThunk(
  '/auth/session',
  async (data) => {
    await axios.get(`${BASE_URL}/auth/session`, {withCredentials: true})
          .then(result => {
            console.log('result', result.data.data.session)

            if(!result.data.data.sesion){
              initialState.userEmail = null
              initialState.userInfo = null
            }

            return result.data.data

          })
          .catch(error => {
            // console.log(error)
            // toast('Afwan, Error ketika login.')
            // this.state.error = true
            // this.state.errorMessage = 'Persist login error: ' + error

          })
    // const res = await fetch(`${BASE_URL}/api/auth/login`).then(
    //   (data) => data.json()
    // )
    // return res
})


// export const postSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {},
//   extraReducers: {
//     [getPosts.pending]: (state) => {
//       state.loading = true
//     },
//     [getPosts.fulfilled]: (state, { payload }) => {
//       state.loading = false
//       state.entities = payload
//     },
//     [getPosts.rejected]: (state) => {
//       state.loading = false
//     },
//   },
// })

// export const postReducer = postSlice.reducer
export const authSlice = createSlice({
  name: "authInfo",
  initialState,
  reducers: {
    // login_: (state, action) => {
    //     axios.post(`${BASE_URL}'/api/auth/login'`, action.payload )
    //       .then(result => {
    //         if(result.status === 200){
    //           Cookies.set('token', result.data.data.token)
    //           state.userInfo = {
    //             username: result.data.data.username,
    //             full_name: result.data.data.full_name,
    //           }
    //           state.orgzInfo = {
    //             orgz_id: result.data.data.orgz_id,
    //             org_name: result.data.data.orgz_name,
    //           }
    //           // toast('Alhamdulillah, Anda berhasil login.')
    //         }
    //       })
    //       .catch(error => {
    //         // console.log(error)
    //         // toast('Afwan, Error ketika login.')
    //         state.error = true
    //         state.errorMessage = 'Persist login error: ' + error

    //       })
    // },
    register: async (state, action) => {
        await axios.post('/api/auth/register', action.payload )
          .then(result => {
            if(result.status === 200){
                // Cookies.set('token', result.data.data.token)
            //   state.userInfo = {
            //     username: result.data.data.username,
            //     full_name: result.data.data.full_name,
            //   }
            //   state.orgzInfo = {
            //     orgz_id: result.data.data.orgz_id,
            //     org_name: result.data.data.orgz_name,
            //   }

            }
          })
          .catch(error => {
            // console.log(error)
            state.error = true
            state.errorMessage = 'Persist login error: ' + error

          })
    },
    resetInfo: (state, action) => {
        state.userInfo = null
        state.orgzInfo = null
        Cookies.remove('token')
    },
    logout: (state, action) => {
        state.userInfo = null
        state.userEmail = null
        // state.orgzInfo = null
        Cookies.remove('token')
    }
    // addToCart: async (state, action) => {
    //   await axios.get('/cart/add/' + action.payload._id)
    //       .then(result => {
    //         if(result.status === 200){
    //           const item = state.products.find(
    //             (item) => item._id === action.payload._id
    //           );
    //           if (item) {
    //                 item.quantity += action.payload.quantity;
    //           } else {
    //             state.products.push(action.payload);
    //           }

    //         }
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
    // },
    // increaseQuantity: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item) {
    //     item.quantity++;
    //   }
    // },
    // drecreaseQuantity: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item.quantity === 1) {
    //     item.quantity = 1;
    //   } else {
    //     item.quantity--;
    //   }
    // },
    // deleteItem: (state, action) => {
    //   state.products = state.products.filter(
    //     (item) => item._id !== action.payload
    //   );
    // },
    // resetCart: (state) => {
    //   state.products = [];
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled, (state, action) => {
        state.error = false
        state.loading = false
        console.log('action.payload', action)
        // // Cookies.set('token', action.payload.token)
        state.userInfo = {
          username: action.meta.arg.username
          // full_name: action.meta.full_name,
        }
        state.userEmail = action.meta.arg.username
        // state.orgzInfo = {
        //   orgz_id: action.payload.orgz_id,
        //   org_name: action.payload.orgz_name,
        // }
        // state.orgzId = action.payload.orgz_id
      },
      login.pending, (state, action) => {
        state.loading = true
      },
      login.rejected, (state, action) => {
        state.error = true
        state.loading = false
      },
      getSession.fulfilled, (state, action) => {
        state.error = false
        state.loading = false
        console.log('action.payload', action)
        // // Cookies.set('token', action.payload.token)
        if(!action.data.data.session){
          state.userEmail = null
          state.userInfo = null
        }
        // state.orgzInfo = {
        //   orgz_id: action.payload.orgz_id,
        //   org_name: action.payload.orgz_name,
        // }
        // state.orgzId = action.payload.orgz_id
      },
      getSession.pending, (state, action) => {
        state.loading = true
      },
      getSession.rejected, (state, action) => {
        state.error = true
        state.loading = false
      }
    )
  }
});

export const {
  login_,
  resetInfo,
  error,
  loading,
  userInfo,
  userEmail,
  logout
} = authSlice.actions;
export default authSlice.reducer;