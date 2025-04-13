'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPills,
  FaSearch,
  FaSortUp,
  FaSortDown,
  FaTrash,
  FaEdit,
  FaSync,
} from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Medicine {
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  pricePerUnit: number;
  createdAt: string;
  updatedAt: string;
}

export default function MedicineListPage() {
  const { 'pharmacy-id': pharmacyId } = useParams();
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Medicine | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pharmacy/${pharmacyId}/medicines-list`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to load medicines');
      } else {
        setMedicines(data.medicines || []);
        setFilteredMedicines(data.medicines || []);
      }
    } catch (err) {
      setError('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [pharmacyId]);

  useEffect(() => {
    let result = [...medicines];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (med) =>
          med.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === 'medicineName') {
          return sortDirection === 'asc'
            ? a.medicineName.localeCompare(b.medicineName)
            : b.medicineName.localeCompare(a.medicineName);
        }
        if (sortBy === 'batchNumber') {
          return sortDirection === 'asc'
            ? a.batchNumber.localeCompare(b.batchNumber)
            : b.batchNumber.localeCompare(a.batchNumber);
        }
        if (sortBy === 'expiryDate') {
          const dateA = new Date(a.expiryDate).getTime();
          const dateB = new Date(b.expiryDate).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (sortBy === 'quantity') {
          return sortDirection === 'asc'
            ? a.quantity - b.quantity
            : b.quantity - a.quantity;
        }
        if (sortBy === 'pricePerUnit') {
          return sortDirection === 'asc'
            ? a.pricePerUnit - b.pricePerUnit
            : b.pricePerUnit - a.pricePerUnit;
        }
        return 0;
      });
    }

    setFilteredMedicines(result);
  }, [searchQuery, sortBy, sortDirection, medicines]);

  const handleAdd = () => {
    router.push(`/pharmacy/${pharmacyId}/add-medicine`);
  };

  const handleEdit = (medicineName: string, batchNumber: string) => {
    router.push(
      `/pharmacy/${pharmacyId}/edit-medicine?medicineName=${medicineName}&batchNumber=${batchNumber}`,
    );
  };

  const handleDelete = async (medicineName: string, batchNumber: string) => {
    try {
      const res = await fetch(`/api/pharmacy/${pharmacyId}/medicines-list`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName, batchNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to delete');
      } else {
        fetchMedicines();
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleSortChange = (value: keyof Medicine) => {
    if (sortBy === value) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const particlesInit = async (engine: Engine) => {
  //   await loadFull(engine);
  // };

  // Pagination logic
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        // init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              onClick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 },
            },
          },
          particles: {
            color: { value: ['#ffffff', '#0d9488', '#7e22ce'] },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: false,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: { value: 0.4 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl mx-auto bg-white bg-opacity-10 backdrop-blur-2xl border border-teal-500/30 rounded-3xl shadow-2xl"
      >
        <Card className="bg-transparent border-none">
          <CardHeader>
            <CardTitle className="text-5xl font-extrabold text-gray-900 text-center">
              Medicine Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-600 text-sm mb-4 text-center bg-red-500/20 p-3 rounded-md font-semibold"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                <Input
                  type="text"
                  placeholder="Search by name or batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white bg-opacity-10 border-teal-500/30 text-gray-800 placeholder-gray-500 rounded-xl focus:ring-teal-500"
                />
              </div>
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-48 bg-white bg-opacity-10 border-teal-500/30 text-gray-800 rounded-xl flex items-center">
                  <SelectValue placeholder="Sort by..." />
                  {sortBy && (
                    <span className="ml-2 text-teal-500">
                      {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-gray-200">
                  <SelectItem value="medicineName">Name</SelectItem>
                  <SelectItem value="batchNumber">Batch</SelectItem>
                  <SelectItem value="expiryDate">Expiry</SelectItem>
                  <SelectItem value="quantity">Quantity</SelectItem>
                  <SelectItem value="pricePerUnit">Price</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={handleAdd}
                    className="w-full md:w-auto bg-teal-600 text-gray-100 hover:bg-teal-700 rounded-xl transition-colors"
                  >
                    <FaPills className="mr-2" /> Add Medicine
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={fetchMedicines}
                    className="w-full md:w-auto bg-purple-600 text-gray-100 hover:bg-purple-700 rounded-xl transition-colors"
                  >
                    <FaSync className="mr-2" /> Refresh
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-12 w-full bg-white/10 rounded-xl"
                  />
                ))}
              </div>
            ) : filteredMedicines.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-center font-semibold"
              >
                No medicines found.
              </motion.p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/10 hover:bg-white/20 border-none">
                      <TableHead className="text-gray-900 text-lg font-semibold">
                        Medicine
                      </TableHead>
                      <TableHead className="text-gray-900 text-lg font-semibold">
                        Batch
                      </TableHead>
                      <TableHead className="text-gray-900 text-lg font-semibold">
                        Expiry
                      </TableHead>
                      <TableHead className="text-gray-900 text-lg font-semibold">
                        Qty
                      </TableHead>
                      <TableHead className="text-gray-900 text-lg font-semibold">
                        Price
                      </TableHead>
                      <TableHead className="text-gray-900 text-lg font-semibold text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMedicines.map((med, index) => (
                      <motion.tr
                        key={`${med.medicineName}-${med.batchNumber}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="border-t border-teal-500/10 hover:bg-teal-500/10 even:bg-white/5"
                      >
                        <TableCell className="text-gray-800 font-semibold">
                          {med.medicineName}
                        </TableCell>
                        <TableCell className="text-gray-800 font-semibold">
                          {med.batchNumber}
                        </TableCell>
                        <TableCell className="text-gray-800 font-semibold">
                          {new Date(med.expiryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-800 font-semibold">
                          {med.quantity}
                        </TableCell>
                        <TableCell className="text-gray-800 font-semibold">
                          ₹{med.pricePerUnit.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center flex justify-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="bg-yellow-600 text-gray-100 border-yellow-500/50 hover:bg-yellow-700 rounded-xl transition-colors"
                                  onClick={() =>
                                    handleEdit(
                                      med.medicineName,
                                      med.batchNumber,
                                    )
                                  }
                                >
                                  <FaEdit />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-gray-200">
                                <p>Edit this medicine</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="bg-red-600 text-gray-100 border-red-500/50 hover:bg-red-700 rounded-xl transition-colors"
                                    >
                                      <FaTrash />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-gray-900 text-gray-200 rounded-xl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Medicine
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete{' '}
                                        {med.medicineName} ({med.batchNumber})?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-gray-800 text-gray-200">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 text-gray-100 hover:bg-red-700"
                                        onClick={() =>
                                          handleDelete(
                                            med.medicineName,
                                            med.batchNumber,
                                          )
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-gray-200">
                                <p>Delete this medicine</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className={
                            currentPage === page
                              ? 'bg-teal-600 text-gray-100'
                              : 'text-gray-200 hover:bg-teal-500/30'
                          }
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';

// interface Medicine {
//   medicineName: string;
//   batchNumber: string;
//   expiryDate: string;
//   quantity: number;
//   pricePerUnit: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function MedicineListPage() {
//   const { 'pharmacy-id': pharmacyId } = useParams();
//   const router = useRouter();
//   const [medicines, setMedicines] = useState<Medicine[]>([]);
//   const [error, setError] = useState('');

//   const fetchMedicines = async () => {
//     try {
//       const res = await fetch(`/api/pharmacy/${pharmacyId}/medicines-list`);
//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Failed to load medicines');
//       } else {
//         setMedicines(data.medicines || []);
//       }
//     } catch (err) {
//       setError('Failed to fetch medicines');
//     }
//   };

//   useEffect(() => {
//     fetchMedicines();
//   }, [pharmacyId]);

//   const handleAdd = () => {
//     router.push(`/pharmacy/${pharmacyId}/add-medicine`);
//   };

//   const handleEdit = (medicineName: string, batchNumber: string) => {
//     router.push(`/pharmacy/${pharmacyId}/edit-medicine?medicineName=${medicineName}&batchNumber=${batchNumber}`);
//   };

//   const handleDelete = async (medicineName: string, batchNumber: string) => {
//     const confirmDelete = confirm(`Are you sure you want to delete ${medicineName} (${batchNumber})?`);
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`/api/pharmacy/${pharmacyId}/medicines-list`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ medicineName, batchNumber }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || 'Failed to delete');
//       } else {
//         fetchMedicines(); // Refresh list
//       }
//     } catch (err) {
//       alert('Server error');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
//       <h2 className="text-2xl font-bold mb-6">Medicine Inventory</h2>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <button
//         onClick={handleAdd}
//         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         + Add Medicine
//       </button>

//       {medicines.length === 0 ? (
//         <p>No medicines found.</p>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 text-left">Medicine</th>
//               <th className="p-2 text-left">Batch</th>
//               <th className="p-2 text-left">Expiry</th>
//               <th className="p-2 text-left">Qty</th>
//               <th className="p-2 text-left">Price</th>
//               <th className="p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {medicines.map((med) => (
//               <tr key={`${med.medicineName}-${med.batchNumber}`} className="border-t">
//                 <td className="p-2">{med.medicineName}</td>
//                 <td className="p-2">{med.batchNumber}</td>
//                 <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
//                 <td className="p-2">{med.quantity}</td>
//                 <td className="p-2">₹{med.pricePerUnit.toFixed(2)}</td>
//                 <td className="p-2 flex justify-center gap-2">
//                   <button
//                     onClick={() => handleEdit(med.medicineName, med.batchNumber)}
//                     className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(med.medicineName, med.batchNumber)}
//                     className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
