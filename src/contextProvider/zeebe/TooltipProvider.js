/* eslint-disable react-hooks/rules-of-hooks */
import {
  useService
} from '../../hooks';

const TooltipProvider = {
  'versionTag': (element) => {

    const translate = useService('translate');

    return (
      <div>
        <p>
          { translate('Version tag by which this decision can be referenced.') }
        </p>
      </div>
    );
  }
};

export default TooltipProvider;
