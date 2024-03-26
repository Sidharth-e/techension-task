// Defining the Error component as a functional component
export default function Error({error}) {
  return (
    <div className='error'>{error}</div>
    //  {/* Rendering the error message passed as a prop */}
  )
}
