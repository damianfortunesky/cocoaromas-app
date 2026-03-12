import { Link, Outlet } from 'react-router-dom';
export function AdminLayout() { return <div><aside><Link to="/admin">Dashboard</Link></aside><section><Outlet /></section></div>; }
