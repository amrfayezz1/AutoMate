import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface DateFieldProps {
  /** ISO YYYY-MM-DD or null */
  value: string | null;
  onChange: (iso: string | null) => void;
  placeholder?: string;
  /** When true, shows a clear button when a value is set */
  clearable?: boolean;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function DateField({
  value,
  onChange,
  placeholder = 'Select date',
  clearable = false,
}: DateFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    // Android closes the picker on dismiss/select; iOS stays open as a spinner.
    if (Platform.OS === 'android') setPickerOpen(false);
    if (event.type === 'set' && selected) {
      onChange(toISODate(selected));
    }
  }

  return (
    <View>
      <Pressable
        onPress={() => setPickerOpen(true)}
        className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px] active:opacity-95"
      >
        <Calendar size={20} strokeWidth={2.25} color="#A1A7B3" />
        <Text
          className={`flex-1 text-base font-sans ${
            value ? 'text-fg-1' : 'text-fg-muted'
          }`}
        >
          {value ? formatDateShort(value) : placeholder}
        </Text>
        {clearable && value && (
          <Pressable
            onPress={() => onChange(null)}
            hitSlop={8}
            className="active:opacity-95"
          >
            <X size={18} strokeWidth={2.25} color="#A1A7B3" />
          </Pressable>
        )}
      </Pressable>

      {pickerOpen && (
        <>
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleChange}
            themeVariant="dark"
          />
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setPickerOpen(false)}
              className="self-end mt-2 px-4 py-2 active:opacity-95"
            >
              <Text className="text-base font-medium text-brand">Done</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
