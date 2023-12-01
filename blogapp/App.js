import Slider from './app/components/Slider';

const data = [
  {
    id: '123',
    thumbnail:
      'https://images.unsplash.com/photo-1682695794947-17061dc284dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'THese are climbers',
    author: 'admin',
  },
  {
    id: '1234',
    thumbnail:
      'https://images.unsplash.com/photo-1700578075560-ebacba6e5d22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Tralalala',
    author: 'admin',
  },
  {
    id: '12345',
    thumbnail:
      'https://images.unsplash.com/photo-1699614614470-97206a4e6c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'novi tile',
    author: 'admin',
  },
  {
    id: '123456',
    thumbnail:
      'https://images.unsplash.com/photo-1699614614470-97206a4e6c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'novi tile',
    author: 'admin',
  },
];

export default function App() {
  return <Slider data={data} title={'Featured posts'} />;
}
