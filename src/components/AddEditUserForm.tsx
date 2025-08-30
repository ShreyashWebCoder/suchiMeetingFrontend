import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

// UserData type (should match Report.tsx)
export interface UserData {
  id?: string;
  name: string;
  level: string;
  type: string;
  org: string;
  duty: string;
  area: string;
  prant: string;
  center: string;
  phone1: string;
  phone2: string;
  email: string;
  abha: string;
  kshetra: string;
  prantka: string;
  exec: string;
  sabha: string;
  prantpr: string;
  kshetrapr: string;
  palak: string;
  gender: string;
  present: string;
}

interface AddEditUserFormProps {
  user?: Partial<UserData>;
  dropdowns: any;
  onCancel: () => void;
  onSubmit?: (data: UserData) => void;
  onUserAdded?: () => void;
}

const genderOptions = [
  { label: 'पुरुष', value: 'm' },
  { label: 'महिला', value: 'f' },
];

const attendanceOptions = [
  { label: 'उपस्थित', value: 'p' },
  { label: 'अनुपस्थित', value: 'a' },
];

const AddEditUserForm: React.FC<AddEditUserFormProps> = ({
  user = {},
  dropdowns = {},
  onCancel,
  onSubmit,
  onUserAdded,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<UserData>({
    defaultValues: {
      name: user.name || '',
      level: user.level || '',
      type: user.type || '',
      org: user.org || '',
      duty: user.duty || '',
      area: user.area || '',
      prant: user.prant || '',
      center: user.center || '',
      phone1: user.phone1 || '',
      phone2: user.phone2 || '',
      email: user.email || '',
      abha: user.abha || '0',
      kshetra: user.kshetra || '0',
      prantka: user.prantka || '0',
      exec: user.exec || '0',
      sabha: user.sabha || '0',
      prantpr: user.prantpr || '0',
      kshetrapr: user.kshetrapr || '0',
      palak: user.palak || '0',
      gender:
        user.gender === 'महिला'
          ? 'f'
          : user.gender === 'पुरुष'
          ? 'm'
          : user.gender === 'f' || user.gender === 'm'
          ? user.gender
          : 'm',
      present:
        user.present === 'उपस्थित'
          ? 'p'
          : user.present === 'अनुपस्थित'
          ? 'a'
          : user.present === 'p' || user.present === 'a'
          ? user.present
          : 'p',
      id: user.id,
    },
  });

  const handleSelect = (name: keyof UserData, value: string) =>
    setValue(name, value, { shouldValidate: true });

  const getDropdownId = (list: any[], name: string) => {
    const found = list?.find((item) => item.name === name);
    return found ? found._id : '';
  };

  const handleFormSubmit = async (data: UserData) => {
    setApiError(null);
    if (onSubmit) {
      const mappedData = {
        ...data,
        gender: data.gender === 'm' ? 'पुरुष' : data.gender === 'f' ? 'महिला' : '',
        present: data.present === 'p' ? 'उपस्थित' : data.present === 'a' ? 'अनुपस्थित' : '',
      };
      onSubmit(mappedData as UserData);
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');
      const payload = {
        name: data.name,
        star_id: getDropdownId(dropdowns.stars, data.level),
        prakar_id: getDropdownId(dropdowns.prakars, data.type),
        sanghatan_id: getDropdownId(dropdowns.sanghatans, data.org),
        dayitva_id: getDropdownId(dropdowns.dayitvas, data.duty),
        kshetra_id: getDropdownId(dropdowns.kshetras, data.area),
        prant_id: getDropdownId(dropdowns.prants, data.prant),
        kendra: data.center,
        mobile_no_1: data.phone1,
        mobile_no_2: data.phone2,
        email: data.email,
        a_b_karykarini_baithak: data.abha === '1',
        kshetra_k_p_baithak: data.kshetra === '1',
        prant_k_p_baithak: data.prantka === '1',
        karyakari_madal: data.exec === '1',
        pratinidhi_sabha: data.sabha === '1',
        prant_p_baithak: data.prantpr === '1',
        kshetra_p_baithak: data.kshetrapr === '1',
        palak_adhikari_baithak: data.palak === '1',
        gender: data.gender,
        attendance: data.present,
      };
      if (
        !payload.star_id ||
        !payload.prakar_id ||
        !payload.sanghatan_id ||
        !payload.dayitva_id ||
        !payload.kshetra_id ||
        !payload.prant_id
      ) {
        setApiError('कृपया सभी आवश्यक ड्रॉपडाउन चुनें।');
        setSubmitting(false);
        return;
      }
      const res = await fetch('https://rss-project-weef.onrender.com/api/admin/add-pratinidhi-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      reset();
      setSubmitting(false);
      if (result && result.user) {
        alert('उपयोगकर्ता सफलतापूर्वक जोड़ा गया।');
        onCancel();
        if (onUserAdded) onUserAdded();
      } else {
        setApiError(result.message || 'कुछ गलत हो गया।');
      }
    } catch (err: any) {
      setSubmitting(false);
      setApiError(err.message || 'कुछ गलत हो गया।');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-6xl">
          {/* ...form fields as in Report.tsx... */}
          {/* Copy the form fields from your Report.tsx AddEditUserForm here for full parity */}
        </div>
      </div>
      {apiError && <div className="text-red-600 text-center">{apiError}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          रद्द करें
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
          {submitting ? 'सहेज रहा है...' : 'सहेजें'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditUserForm;
