import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function Header(setWs) {
	const { username, setUsername, setId } = useContext(UserContext);
	const navigate = useNavigate();

	function logout() {
		axios.post('/logout').then(() => {
			setWs;
			setId(null);
			setUsername(null);
		});
		navigate(0);
	}

	return (
		<div className='header flex flex-row p-5 bg-blue-500 text-white'>
			<p className='grow '>
				Hello <span className='font-bold'>{username}</span>
			</p>
			<div className='flex-none w-15'>
				<button className='rounded-sm p-3 hover:text-red-700' onClick={logout}>
					Logout
				</button>
			</div>
		</div>
	);
}
