import { useState, useEffect } from 'react'
import Nav from './Nav'
import axios from 'axios'
import Spinner from './Spinner'
import Pagination from './Pagination'
import Modal from './Modal'
import { useSearchParams } from 'react-router-dom'

function LaunchesList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [rockets, setRockets] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rocketsPerPage, setRocketsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [oneRocket, setOneRocket] = useState({})
  const [status, setStatus] = useState('')
  const [originalLaunch, setOriginalLaunch] = useState('')
  const [type, setType] = useState('')
  const [originalRockets, setOriginalRockets] = useState([])

  const handleOpenModal = async (id) => {
    setShowModal(true)
    await axios
      .get(`https://api.spacexdata.com/v3/rockets/${id}`)
      .then((res) => setOneRocket(res.data))
  }

  // Card component to display rocket details
  const RocketCard = ({ rocket }) => {
    return (
      <div
        className="bg-gray-100 p-6 rounded-md shadow-md"
        onClick={() => handleOpenModal(rocket.id)}
      >
        <div className="text-lg font-semibold">
          {rocket.id} - {rocket.rocket_name}
        </div>
        <div className="text-gray-500 mt-2">
          First Flight: {rocket.first_flight}
        </div>
        <div className="text-gray-500 mt-2">Company: {rocket.company}</div>
        <div className="text-gray-500 mt-2">Country: {rocket.country}</div>
        <div className="text-gray-500 mt-2">
          Rocket Status:{' '}
          <span
            className={`${
              rocket.active
                ? 'bg-green-200 rounded-full px-3 py-0.5 text-green-700 font-semibold'
                : 'bg-red-200 rounded-full px-3 py-0.5 text-red-700 font-semibold'
            }`}
          >
            {rocket.active ? 'Success' : 'Failed'}
          </span>
        </div>
      </div>
    )
  }

  const getRocketsDetails = async () => {
    const url = `https://api.spacexdata.com/v3/rockets`
    setLoading(true)
    await axios.get(`${url}`).then((res) => {
      setRockets(res.data)
      setOriginalRockets(res.data)
      console.log(res.data)
    })
    setLoading(false)
  }

  useEffect(() => {
    getRocketsDetails()
  }, [])

  const handleSearch = () => {
    setLoading(true)

    // Filter rockets based on selected filters
    const filteredData = originalRockets.filter((item) => {
      return (
        (status === '' || item.active === (status === 'true')) &&
        (type === '' || item.rocket_type.includes(type))
      )
    })

    // Update rockets with filtered data
    setRockets(filteredData)

    // Reset pagination to first page
    setCurrentPage(1)
    setLoading(false)
  }

  //getIndex of the lastRocket
  const indexOfLastRocket = currentPage * rocketsPerPage
  const indexOfFirstRocket = indexOfLastRocket - rocketsPerPage
  const currentRockets = rockets.slice(indexOfFirstRocket, indexOfLastRocket)

  //changepage
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleModalClose = () => setShowModal(false)

  const handleFilterSelect = (e) => {
    const { value } = e.target
    setSearchParams({ status: value })
  }

  return (
    <>
      <Modal
        oneRocket={oneRocket}
        visible={showModal}
        onClose={handleModalClose}
      />

      {/* nav starts here */}
      <Nav />
      {/* nav ends here */}

      {/* baner start here */}
      <div className="banner-container bg-gradient-to-r from-blue-500 to-purple-500 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Explore SpaceX Rockets and Capsules
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:max-w-3xl">
              Discover advanced rockets and spacecraft launched by SpaceX.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="#search-form" // Replace this with the ID of the search form section
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* baner ends here */}

      {/* search form is start here */}
      <div id="search-form" className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">
              Search Rockets by Filters:
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Retired</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Type"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* search form is end here */}

      <div className="container mx-auto px-4 sm:px-8 mt-5">
        <div className="pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="h-[80vh] flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              currentRockets.map((rocket) => (
                <div key={rocket.id}>
                  <RocketCard rocket={rocket} />
                </div>
              ))
            )}
          </div>
          <Pagination
            rocketsPerPage={rocketsPerPage}
            totalRockets={rockets.length}
            paginate={paginate}
            currentRockets={currentRockets}
          />
        </div>
      </div>
    </>
  )
}

export default LaunchesList
