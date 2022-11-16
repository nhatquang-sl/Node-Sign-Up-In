import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { openHeader } from 'store/settings/actions';
// import useApiService from 'hooks/use-api-service';
import LoadingButton from '@mui/lab/LoadingButton';
import { decrement, increment, incrementByAmount } from 'store/counter-slice';
import { RootState } from 'store';

const Dashboard = () => {
  const dispatch = useDispatch();

  const count = useSelector((state: RootState) => state.counter.count);
  const [incrementAmount, setIncrementAmount] = useState('');

  const addValue = Number(incrementAmount) || 0;

  const resetAll = () => {
    setIncrementAmount('');
    dispatch(incrementByAmount(0));
  };

  // useEffect(() => {
  //   dispatch(openHeader());
  // }, [dispatch]);

  // const getSessions = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await apiService.get(`user/sessions`);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.log({ err });
  //   }
  //   setLoading(false);
  // };

  return (
    <div>
      {/* <LoadingButton
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={loading}
        onClick={getSessions}
      >
        Get Sessions
      </LoadingButton> */}
      <section>
        <p>{count}</p>
        <div>
          <button onClick={() => dispatch(increment())}>+</button>
          <button onClick={() => dispatch(decrement())}>-</button>
        </div>
        <input
          type="text"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <div>
          <button onClick={() => dispatch(incrementByAmount(addValue))}>Add Amount</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
