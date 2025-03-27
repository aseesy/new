import React, { useEffect, useState } from 'react'
import NCheckbox from '../ui/NCheckbox'
import NText from '../ui/NText'
import ELink from '../ui/ELink'
import { navigate } from '../../utils/navigationUtils'
import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '../../constants/config'

const TermsAndConditions = ({onAgree}: {onAgree: (v: boolean) => void}) => {

  const [check, setCheck] = useState<boolean>(false);

  useEffect(() => {
    onAgree?.(check);
  }, [check]);

 const handlePress = (url: string, title: string) => {
  navigate('/webview', {
    url,
    title,
  })
 };
  
  const label = <NText variant='h6'>I agree to the
    <ELink onPress={() => handlePress(PRIVACY_POLICY_URL, 'Privacy Policy')} > Privacy Policy </ELink> and <ELink onPress={() => handlePress(TERMS_AND_CONDITIONS_URL, 'Terms & Conditions')}> Terms of Service</ELink>.
  </NText>

  return (
    <NCheckbox label={label} onChange={setCheck} value={check} />
  )
}

export default TermsAndConditions