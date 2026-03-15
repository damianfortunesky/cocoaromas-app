import { useEffect, useState } from 'react';
import {
  useCreateAddress,
  useDeleteAddress,
  useMyAddresses,
  useMyProfile,
  useUpdateAddress,
  useUpdateMyProfile
} from '@/modules/account/application/useAccount';
import type { UserAddress, UserAddressInput } from '@/modules/account/domain/account.types';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { Loader } from '@/shared/ui/Loader/Loader';
import styles from './MyAccountPage.module.scss';

const emptyAddress: UserAddressInput = {
  label: '',
  recipient: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefaultShipping: false,
  isDefaultBilling: false
};

export function MyAccountPage() {
  const profileQuery = useMyProfile();
  const addressesQuery = useMyAddresses();

  const updateProfile = useUpdateMyProfile();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', documentId: '' });
  const [addressForm, setAddressForm] = useState<UserAddressInput>(emptyAddress);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  useEffect(() => {
    if (!profileQuery.data) return;
    setProfileForm({
      firstName: profileQuery.data.firstName,
      lastName: profileQuery.data.lastName,
      phone: profileQuery.data.phone ?? '',
      documentId: profileQuery.data.documentId ?? ''
    });
  }, [profileQuery.data]);

  const onSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateProfile.mutateAsync({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone || undefined,
      documentId: profileForm.documentId || undefined
    });
  };

  const onEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      recipient: address.recipient,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling
    });
  };

  const onSaveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      ...addressForm,
      line1: addressForm.line1.trim(),
      city: addressForm.city.trim(),
      label: addressForm.label?.trim() || undefined,
      recipient: addressForm.recipient?.trim() || undefined,
      line2: addressForm.line2?.trim() || undefined,
      state: addressForm.state?.trim() || undefined,
      postalCode: addressForm.postalCode?.trim() || undefined,
      country: addressForm.country?.trim() || undefined,
      isDefaultShipping: !!addressForm.isDefaultShipping,
      isDefaultBilling: !!addressForm.isDefaultBilling
    };

    if (editingAddress) {
      await updateAddress.mutateAsync({ id: editingAddress.id, data: payload });
    } else {
      await createAddress.mutateAsync(payload);
    }

    setEditingAddress(null);
    setAddressForm(emptyAddress);
  };

  const isAddressMutating = createAddress.isPending || updateAddress.isPending || deleteAddress.isPending;

  return (
    <section className={styles.container}>
      <header>
        <h1>Mi cuenta</h1>
        <p>Completá tu perfil y administrá direcciones para envíos y facturación.</p>
      </header>

      {(profileQuery.isLoading || addressesQuery.isLoading) && <div className={styles.loader}><Loader /> Cargando datos...</div>}
      {(profileQuery.isError || addressesQuery.isError) && <Alert variant="danger">No se pudieron cargar tus datos.</Alert>}

      <article className={styles.card}>
        <h2>Datos personales</h2>
        <form className={styles.form} onSubmit={onSaveProfile}>
          <label>
            Nombre
            <input value={profileForm.firstName} onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))} />
          </label>
          <label>
            Apellido
            <input value={profileForm.lastName} onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))} />
          </label>
          <label>
            Teléfono
            <input value={profileForm.phone} onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))} />
          </label>
          <label>
            Documento
            <input value={profileForm.documentId} onChange={(event) => setProfileForm((prev) => ({ ...prev, documentId: event.target.value }))} />
          </label>

          <Button type="submit" loading={updateProfile.isPending} disabled={updateProfile.isPending}>Guardar perfil</Button>
        </form>
      </article>

      <article className={styles.card}>
        <h2>{editingAddress ? 'Editar dirección' : 'Nueva dirección'}</h2>
        <form className={styles.form} onSubmit={onSaveAddress}>
          <label>Etiqueta<input value={addressForm.label ?? ''} onChange={(event) => setAddressForm((prev) => ({ ...prev, label: event.target.value }))} /></label>
          <label>Destinatario<input value={addressForm.recipient ?? ''} onChange={(event) => setAddressForm((prev) => ({ ...prev, recipient: event.target.value }))} /></label>
          <label>Calle y número<input required value={addressForm.line1} onChange={(event) => setAddressForm((prev) => ({ ...prev, line1: event.target.value }))} /></label>
          <label>Departamento/piso<input value={addressForm.line2 ?? ''} onChange={(event) => setAddressForm((prev) => ({ ...prev, line2: event.target.value }))} /></label>
          <label>Ciudad<input required value={addressForm.city} onChange={(event) => setAddressForm((prev) => ({ ...prev, city: event.target.value }))} /></label>
          <label>Provincia<input value={addressForm.state ?? ''} onChange={(event) => setAddressForm((prev) => ({ ...prev, state: event.target.value }))} /></label>
          <label>Código postal<input value={addressForm.postalCode ?? ''} onChange={(event) => setAddressForm((prev) => ({ ...prev, postalCode: event.target.value }))} /></label>
          <label>País<input value={addressForm.country ?? ''} onChange={(event) => setAddressForm((prev) => ({ ...prev, country: event.target.value }))} /></label>

          <label className={styles.checkbox}><input type="checkbox" checked={!!addressForm.isDefaultShipping} onChange={(event) => setAddressForm((prev) => ({ ...prev, isDefaultShipping: event.target.checked }))} />Default envío</label>
          <label className={styles.checkbox}><input type="checkbox" checked={!!addressForm.isDefaultBilling} onChange={(event) => setAddressForm((prev) => ({ ...prev, isDefaultBilling: event.target.checked }))} />Default facturación</label>

          <div className={styles.actions}>
            <Button type="submit" loading={isAddressMutating} disabled={isAddressMutating}>{editingAddress ? 'Guardar dirección' : 'Agregar dirección'}</Button>
            {editingAddress && <Button type="button" variant="secondary" onClick={() => { setEditingAddress(null); setAddressForm(emptyAddress); }}>Cancelar</Button>}
          </div>
        </form>

        <div className={styles.addresses}>
          {(addressesQuery.data ?? []).map((address) => (
            <article key={address.id} className={styles.addressCard}>
              <strong>{address.label || address.line1}</strong>
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p>{address.city}{address.state ? `, ${address.state}` : ''}</p>
              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => onEditAddress(address)}>Editar</Button>
                <Button type="button" variant="secondary" onClick={() => void deleteAddress.mutateAsync(address.id)}>Eliminar</Button>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}
